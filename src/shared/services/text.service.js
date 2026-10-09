import { useI18n } from 'vue-i18n';
export function useText() {
    const { t, te, locale } = useI18n();
    const key = (value) =>
        String(value)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    const tr = (value) => (te(key(value)) ? t(key(value)) : String(value ?? ''));
    const show = (value, label = '') =>
        value === null || value === undefined || value === ''
            ? '—'
            : Array.isArray(value)
                ? value.map(tr).join(', ')
                : typeof value === 'number'
                    ? new Intl.NumberFormat(locale.value, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: /cost|premium|price|balance|amount|maximum sold/i.test(label)
                            ? 2
                            : 0,
                    }).format(value)
                    : tr(value);
    return { tr, show };
}
