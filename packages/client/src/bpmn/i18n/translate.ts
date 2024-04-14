import i18nTranslate_en from "./en";
import i18nTranslate_zh from "./zh";

const i18nMap: { [key: string]: { [key: string]: string } } = {
    zh: i18nTranslate_zh,
    en: i18nTranslate_en,
};

function getLanguageTranslatorMap(lang: string): {
    [key: string]: string;
} {
    return i18nMap[lang];
}

function translate(lang: string, text: string): string {
    return getLanguageTranslatorMap(lang)[text] || text;
}

export function getTranslatorFn(lang: string) {
    return function (text: string) {
        return translate(lang, text);
    };
}

export default function getI18nTranslate(
    i18n: string
): (template: string, replacements: { [index: string]: string }) => any {
    const i18nTranslate: any = i18nMap[i18n];
    return function customTranslate(template, replacements) {
        replacements = replacements || {};

        // Translate
        template = i18nTranslate[template] || template;

        // Replace
        return template.replace(
            /{([^}]+)}/g,
            function (_: string, key: string) {
                return replacements[key] || "{" + key + "}";
            }
        );
    };
}
