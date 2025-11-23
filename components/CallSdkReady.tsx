"use client"

import { useEffect } from 'react'

function tryCallReady() {
  try {
    if (typeof window === 'undefined') return
    const maybeSdk = (window as any).sdk ?? (window as any).host ?? (window as any).farcaster ?? null
    if (maybeSdk && maybeSdk.actions && typeof maybeSdk.actions.ready === 'function') {
      try {
        maybeSdk.actions.ready()
      } catch (e) {
        // swallow errors from host SDK
      }
    }
  } catch (e) {
    // defensive: ignore any unexpected errors
  }
}

// Try immediately (module-eval / import time) so host sees ready as early as possible
tryCallReady()

export default function CallSdkReady() {
  // Also call on mount as a fallback
  useEffect(() => {
    tryCallReady()
  }, [])

  return null
}
