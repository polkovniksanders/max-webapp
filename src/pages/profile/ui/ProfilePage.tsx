import { useState } from 'react'
import { getWebApp } from '@shared/bridge'
import styles from './ProfilePage.module.css'

export const ProfilePage = () => {
  const webApp = getWebApp()
  const data = webApp?.initDataUnsafe
  const user = data?.user
  const [copied, setCopied] = useState(false)

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Пользователь'
  const avatarLetter = (user?.first_name ?? fullName)[0]?.toUpperCase() ?? '?'

  const authDateFormatted = data?.auth_date
    ? new Date(data.auth_date * 1000).toLocaleString('ru-RU')
    : null

  const handleCopyInitData = () => {
    const raw = webApp?.initData ?? ''
    if (!raw) return
    navigator.clipboard.writeText(raw).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Профиль</h1>

      {/* Аватар + базовая инфо */}
      <div className={styles.userCard}>
        {user?.photo_url ? (
          <img src={user.photo_url} alt={fullName} className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder}>{avatarLetter}</div>
        )}
        <div className={styles.userInfo}>
          <div className={styles.userName}>{fullName}</div>
          {user?.username && <div className={styles.userHandle}>@{user.username}</div>}
          {user?.id && <div className={styles.userId}>ID: {user.id}</div>}
        </div>
      </div>

      {/* Данные пользователя */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>Пользователь</div>
        <div className={styles.infoList}>
          <Row label="Имя" value={user?.first_name} />
          <Row label="Фамилия" value={user?.last_name} />
          <Row label="Username" value={user?.username ? `@${user.username}` : undefined} />
          <Row label="ID" value={user?.id?.toString()} />
          <Row label="Язык" value={user?.language_code?.toUpperCase()} />
          <Row label="Фото" value={user?.photo_url} truncate />
        </div>
      </section>

      {/* Данные сессии */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>Сессия</div>
        <div className={styles.infoList}>
          <Row label="auth_date" value={authDateFormatted} />
          <Row label="query_id" value={data?.query_id} mono truncate />
          <Row label="start_param" value={data?.start_param} mono />
          <Row label="IP" value={data?.ip} mono />
          <Row label="Hash" value={data?.hash} mono truncate />
        </div>
      </section>

      {/* Чат */}
      {data?.chat && (
        <section className={styles.section}>
          <div className={styles.sectionTitle}>Чат</div>
          <div className={styles.infoList}>
            <Row label="ID чата" value={String(data.chat.id)} />
            <Row label="Тип" value={data.chat.type} />
          </div>
        </section>
      )}

      {/* Техническая информация */}
      <section className={styles.section}>
        <div className={styles.sectionTitle}>Техническая информация</div>
        <div className={styles.infoList}>
          <Row label="Платформа" value={webApp?.platform ?? 'н/д'} mono />
          <Row label="Bridge версия" value={webApp?.version ?? 'н/д'} mono />
          <Row label="initData" value={webApp?.initData ? 'есть' : 'нет'} />
        </div>

        {webApp?.initData && (
          <div className={styles.rawBlock}>
            <div className={styles.rawLabel}>
              <span>Raw initData</span>
              <button className={styles.copyBtn} onClick={handleCopyInitData}>
                {copied ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>
            <pre className={styles.rawValue}>{webApp.initData}</pre>
          </div>
        )}
      </section>

      <button className={styles.closeBtn} onClick={() => webApp?.close()}>
        Закрыть приложение
      </button>
    </div>
  )
}

interface RowProps {
  label: string
  value?: string | null
  mono?: boolean
  truncate?: boolean
}

const Row = ({ label, value, mono, truncate }: RowProps) => {
  if (!value) return null
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={`${styles.rowValue} ${mono ? styles.mono : ''} ${truncate ? styles.truncate : ''}`}>
        {value}
      </span>
    </div>
  )
}
