"use client"

import Link from "next/link"
import AdminLayout from "@component/admin/AdminLayout"
import { settings } from "@/config/breadcrumb"
import { CONFIG_GROUPS } from "@feature/cau-hinh/configGroups"
import styles from "./index.module.scss"

export default function ConfigsHubPage() {
  return (
    <AdminLayout breadcrumb={settings.list} hideSidebar>
      <div className={styles.configsGrid}>
        {CONFIG_GROUPS.map((group) => (
          <div key={group.title} className={styles.configCard}>
            <div className={styles.configCardHead}>
              <span className={styles.configCardIcon}><i className={`fas ${group.icon}`}/></span>
              <h3>{group.title}</h3>
            </div>
            <div className={styles.configCardLinks}>
              {group.links.map((link) => (
                link.href ? (
                  <Link key={link.label} href={link.href}>{link.label}</Link>
                ) : (
                  <span key={link.label}>{link.label}</span>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
