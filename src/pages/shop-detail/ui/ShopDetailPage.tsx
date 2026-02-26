import { useGetShopQuery } from '@entities/shop'
import { useBackButton } from '@shared/hooks/useBackButton'
import styles from './ShopDetailPage.module.css'

export const ShopDetailPage = () => {
  const { data: shop, isLoading, isError, refetch } = useGetShopQuery()

  useBackButton()

  return (
    <div className={styles.page}>
      {isLoading && (
        <div className={styles.stateWrap}>
          <div className={styles.spinner} />
        </div>
      )}

      {isError && (
        <div className={styles.stateWrap}>
          <div className={styles.errorIcon}>!</div>
          <span className={styles.stateText}>Не удалось загрузить информацию о магазине</span>
          <button className={styles.retryBtn} onClick={refetch}>Повторить</button>
        </div>
      )}

      {shop && (
        <>
          {/* Шапка */}
          <div className={styles.header}>
            {shop.photo ? (
              <img src={shop.photo} alt={shop.name} className={styles.photo} />
            ) : (
              <div className={styles.photoPlaceholder}>
                {shop.name[0].toUpperCase()}
              </div>
            )}
            <h1 className={styles.name}>{shop.name}</h1>
            {shop.about && <p className={styles.about}>{shop.about}</p>}
          </div>

          {/* Ссылки и контакты */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>Контакты и ссылки</div>
            <div className={styles.infoList}>
              {shop.details?.contact_info && (
                <a
                  href={shop.details.contact_info}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.linkRow}
                >
                  <span className={styles.rowLabel}>Контакт</span>
                  <span className={`${styles.rowValue} ${styles.accent}`}>
                    {shop.details.contact_info}
                  </span>
                </a>
              )}
              {shop.shop_link && (
                <a
                  href={shop.shop_link}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.linkRow}
                >
                  <span className={styles.rowLabel}>Ссылка на магазин</span>
                  <span className={`${styles.rowValue} ${styles.accent}`}>
                    {shop.shop_link}
                  </span>
                </a>
              )}
              {shop.bot_name && (
                <div className={styles.row}>
                  <span className={styles.rowLabel}>Бот</span>
                  <span className={styles.rowValue}>@{shop.bot_name}</span>
                </div>
              )}
              {shop.payment_system && (
                <div className={styles.row}>
                  <span className={styles.rowLabel}>Оплата</span>
                  <span className={styles.rowValue}>{shop.payment_system}</span>
                </div>
              )}
            </div>
          </section>

          {/* Юридическая информация */}
          {shop.legal_info && (
            <section className={styles.section}>
              <div className={styles.sectionTitle}>Юридическая информация</div>
              <div className={styles.infoList}>
                {shop.legal_info.name && (
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Организация</span>
                    <span className={styles.rowValue}>{shop.legal_info.name}</span>
                  </div>
                )}
                {shop.legal_info.inn && (
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>ИНН</span>
                    <span className={`${styles.rowValue} ${styles.mono}`}>{shop.legal_info.inn}</span>
                  </div>
                )}
                {shop.legal_info.kpp && (
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>КПП</span>
                    <span className={`${styles.rowValue} ${styles.mono}`}>{shop.legal_info.kpp}</span>
                  </div>
                )}
                {shop.legal_info.ogrn && (
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>ОГРН</span>
                    <span className={`${styles.rowValue} ${styles.mono}`}>{shop.legal_info.ogrn}</span>
                  </div>
                )}
                {shop.legal_info.email && (
                  <a
                    href={`mailto:${shop.legal_info.email}`}
                    className={styles.linkRow}
                  >
                    <span className={styles.rowLabel}>Email</span>
                    <span className={`${styles.rowValue} ${styles.accent}`}>{shop.legal_info.email}</span>
                  </a>
                )}
                {shop.legal_info.phone && (
                  <a
                    href={`tel:${shop.legal_info.phone}`}
                    className={styles.linkRow}
                  >
                    <span className={styles.rowLabel}>Телефон</span>
                    <span className={`${styles.rowValue} ${styles.accent}`}>+{shop.legal_info.phone}</span>
                  </a>
                )}
                {shop.legal_info.address && (
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Адрес</span>
                    <span className={`${styles.rowValue} ${styles.textRight}`}>{shop.legal_info.address}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Документы */}
          {shop.available_documents.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionTitle}>Документы</div>
              <div className={styles.infoList}>
                {shop.available_documents.map((doc) => (
                  <div key={doc.type} className={styles.row}>
                    <span className={styles.rowValue}>{doc.title}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
