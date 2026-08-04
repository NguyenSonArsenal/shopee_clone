"use client"

import styles from "./index.module.scss"

export default function Index({ text = "Đang tải..." }: { text?: string }) {
  return (
    <div className={styles.overlay}>
      {text}
      <div>
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  )
}
