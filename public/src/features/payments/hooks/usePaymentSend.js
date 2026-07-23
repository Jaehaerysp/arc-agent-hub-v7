import { useCallback } from 'react'
import { ethers } from 'ethers'
import { useContractWrite } from '../../../hooks/useContractWrite'
import { ERC20_ABI } from '../../../contracts/abis/erc20'
import { USDC_TOKEN } from '../services/usdcPaymentService'
import { shortAddr } from '../../../lib/format'

/**
 * Sends a payment in any token this feature supports (Sprint 2 —
 * Universal Payment Support), using the same tx lifecycle
 * (loading/error/success, activity logging) every other write in this app
 * already shares via `useContractWrite` — Transfer's ANV send, Agents'
 * registration, etc.
 *
 * `useContractWrite` is bound to USDC's address/ABI at hook creation (so
 * this still behaves exactly as before for the default/no-token case),
 * but `execute`'s optional 4th argument (a contract override) lets a
 * single call send any ERC-20 in `PAYMENT_TOKENS` without re-instantiating
 * the hook per token — every token here shares the same `ERC20_ABI`
 * `transfer` shape, only the address and decimals differ.
 *
 * Signing always goes through the browser wallet's `signer` passed in —
 * never a raw private key.
 */
export function usePaymentSend(signer, addActivity) {
  const { execute, loading, error, success, reset } = useContractWrite({
    address: USDC_TOKEN.address,
    abi: ERC20_ABI,
    signer,
    addActivity,
  })

  const sendPayment = useCallback(
    async (token, to, amount) => {
      const parsedAmount = ethers.parseUnits(amount, token.decimals)

      return execute(
        'transfer',
        [to, parsedAmount],
        {
          type: 'payment',
          label: `${token.symbol} payment`,
          failLabel: 'Payment failed',
          detail: `${amount} ${token.symbol} → ${shortAddr(to)}`,
        },
        { address: token.address, abi: ERC20_ABI }
      )
    },
    [execute]
  )

  return { sendPayment, loading, error, success, reset }
}
