'use strict';

const Path = require('path');

const formatLocalization = (localeString, REPLACEMENTS) => {

    REPLACEMENTS = REPLACEMENTS || [];
    REPLACEMENTS.forEach((replacement, index) => {

        localeString = localeString.replace(`{${index}}`, REPLACEMENTS[index]);
    });
    return localeString;
};

module.exports = function (LANG_CODE, locale_path) {

    const lang_file = require(Path.join(locale_path, `${LANG_CODE.toLocaleLowerCase()}.js`));

    return (STRING_CODE, REPLACEMENTS) => {

        if (!((typeof STRING_CODE === 'string') || (STRING_CODE instanceof String))) {
            return JSON.stringify(STRING_CODE);
        }

        if (REPLACEMENTS && !Array.isArray(REPLACEMENTS)) {
            REPLACEMENTS = [REPLACEMENTS];
        }

        if (lang_file[STRING_CODE]) {
            return formatLocalization(lang_file[STRING_CODE], REPLACEMENTS);
        }
        return formatLocalization(STRING_CODE, REPLACEMENTS);
    };
};
