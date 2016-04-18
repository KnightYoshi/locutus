module.exports = function setlocale (category, locale) {
  //  discuss at: http://locutusjs.org/php/setlocale/
  // original by: Brett Zamir (http://brett-zamir.me)
  // original by: Blues (http://hacks.bluesmoon.info/strftime/strftime.js)
  // original by: YUI Library (http://developer.yahoo.com/yui/docs/YAHOO.util.DateLocale.html)
  //  depends on: getenv
  //        note: Is extensible, but currently only implements locales en,
  //        note: en_US, en_GB, en_AU, fr, and fr_CA for LC_TIME only; C for LC_CTYPE;
  //        note: C and en for LC_MONETARY/LC_NUMERIC; en for LC_COLLATE
  //        note: Uses global: php_js to store locale info
  //        note: Consider using http://demo.icu-project.org/icu-bin/locexp as basis for localization (as in i18n_loc_set_default())
  //   example 1: setlocale('LC_ALL', 'en_US');
  //   returns 1: 'en_US'

  var categ = '',
    cats = [],
    i = 0,
    d = this.window.document

  // BEGIN STATIC
  var _copy = function _copy (orig) {
    if (orig instanceof RegExp) {
      return new RegExp(orig)
    } else if (orig instanceof Date) {
      return new Date(orig)
    }
    var newObj = {}
    for (var i in orig) {
      if (typeof orig[i] === 'object') {
        newObj[i] = _copy(orig[i])
      } else {
        newObj[i] = orig[i]
      }
    }
    return newObj
  }

  // Function usable by a ngettext implementation (apparently not an accessible part of setlocale(), but locale-specific)
  // See http://www.gnu.org/software/gettext/manual/gettext.html#Plural-forms though amended with others from
  // https://developer.mozilla.org/En/Localization_and_Plurals (new categories noted with "MDC" below, though
  // not sure of whether there is a convention for the relative order of these newer groups as far as ngettext)
  // The function name indicates the number of plural forms (nplural)
  // Need to look into http://cldr.unicode.org/ (maybe future JavaScript); Dojo has some functions (under new BSD),
  // including JSON conversions of LDML XML from CLDR: http://bugs.dojotoolkit.org/browser/dojo/trunk/cldr
  // and docs at http://api.dojotoolkit.org/jsdoc/HEAD/dojo.cldr
  var _nplurals1 = function (n) {
    // e.g., Japanese
    return 0
  }
  var _nplurals2a = function (n) {
    // e.g., English
    return n !== 1 ? 1 : 0
  }
  var _nplurals2b = function (n) {
    // e.g., French
    return n > 1 ? 1 : 0
  }
  var _nplurals2c = function (n) {
    // e.g., Icelandic (MDC)
    return n % 10 === 1 && n % 100 !== 11 ? 0 : 1
  }
  var _nplurals3a = function (n) {
    // e.g., Latvian (MDC has a different order from gettext)
    return n % 10 === 1 && n % 100 !== 11 ? 0 : n !== 0 ? 1 : 2
  }
  var _nplurals3b = function (n) {
    // e.g., Scottish Gaelic
    return n === 1 ? 0 : n === 2 ? 1 : 2
  }
  var _nplurals3c = function (n) {
    // e.g., Romanian
    return n === 1 ? 0 : (n === 0 || (n % 100 > 0 && n % 100 < 20)) ? 1 : 2
  }
  var _nplurals3d = function (n) {
    // e.g., Lithuanian (MDC has a different order from gettext)
    return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
  }
  var _nplurals3e = function (n) {
    // e.g., Croatian
    return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 :
      2
  }
  var _nplurals3f = function (n) {
    // e.g., Slovak
    return n === 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2
  }
  var _nplurals3g = function (n) {
    // e.g., Polish
    return n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
  }
  var _nplurals3h = function (n) {
    // e.g., Macedonian (MDC)
    return n % 10 === 1 ? 0 : n % 10 === 2 ? 1 : 2
  }
  var _nplurals4a = function (n) {
    // e.g., Slovenian
    return n % 100 === 1 ? 0 : n % 100 === 2 ? 1 : n % 100 === 3 || n % 100 === 4 ? 2 : 3
  }
  var _nplurals4b = function (n) {
    // e.g., Maltese (MDC)
    return n === 1 ? 0 : n === 0 || (n % 100 && n % 100 <= 10) ? 1 : n % 100 >= 11 && n % 100 <= 19 ? 2 : 3
  }
  var _nplurals5 = function (n) {
    // e.g., Irish Gaeilge (MDC)
    return n === 1 ? 0 : n === 2 ? 1 : n >= 3 && n <= 6 ? 2 : n >= 7 && n <= 10 ? 3 : 4
  }
  var _nplurals6 = function (n) {
    // e.g., Arabic (MDC) - Per MDC puts 0 as last group
    return n === 0 ? 5 : n === 1 ? 0 : n === 2 ? 1 : n % 100 >= 3 && n % 100 <= 10 ? 2 : n % 100 >= 11 && n % 100 <=
      99 ? 3 : 4
  }
  // END STATIC
  // BEGIN REDUNDANT
  try {
    this.php_js = this.php_js || {}
  } catch (e) {
    this.php_js = {}
  }

  var locutus = this.php_js

  // Reconcile Windows vs. *nix locale names?
  // Allow different priority orders of languages, esp. if implement gettext as in
  //     LANGUAGE env. var.? (e.g., show German if French is not available)
  if (!locutus.locales) {
    // Can add to the locales
    locutus.locales = {}

    locutus.locales.en = {
      'LC_COLLATE': // For strcoll

        function (str1, str2) {
        // Fix: This one taken from strcmp, but need for other locales; we don't use localeCompare since its locale is not settable
          return (str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1)
        },
      'LC_CTYPE': {
        // Need to change any of these for English as opposed to C?
        an: /^[A-Za-z\d]+$/g,
        al: /^[A-Za-z]+$/g,
        ct: /^[\u0000-\u001F\u007F]+$/g,
        dg: /^[\d]+$/g,
        gr: /^[\u0021-\u007E]+$/g,
        lw: /^[a-z]+$/g,
        pr: /^[\u0020-\u007E]+$/g,
        pu: /^[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+$/g,
        sp: /^[\f\n\r\t\v ]+$/g,
        up: /^[A-Z]+$/g,
        xd: /^[A-Fa-f\d]+$/g,
        CODESET: 'UTF-8',
        // Used by sql_regcase
        lower: 'abcdefghijklmnopqrstuvwxyz',
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      },
      'LC_TIME': {
        // Comments include nl_langinfo() constant equivalents and any changes from Blues' implementation
        a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        // ABDAY_
        A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        // DAY_
        b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        // ABMON_
        B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
          'November', 'December'
        ],
        // MON_
        c: '%a %d %b %Y %r %Z',
        // D_T_FMT // changed %T to %r per results
        p: ['AM', 'PM'],
        // AM_STR/PM_STR
        P: ['am', 'pm'],
        // Not available in nl_langinfo()
        r: '%I:%M:%S %p',
        // T_FMT_AMPM (Fixed for all locales)
        x: '%m/%d/%Y',
        // D_FMT // switched order of %m and %d; changed %y to %Y (C uses %y)
        X: '%r',
        // T_FMT // changed from %T to %r  (%T is default for C, not English US)
        // Following are from nl_langinfo() or http://www.cptec.inpe.br/sx4/sx4man2/g1ab02e/strftime.4.html
        alt_digits: '',
        // e.g., ordinal
        ERA: '',
        ERA_YEAR: '',
        ERA_D_T_FMT: '',
        ERA_D_FMT: '',
        ERA_T_FMT: ''
      },
      // Assuming distinction between numeric and monetary is thus:
      // See below for C locale
      'LC_MONETARY': {
        // based on Windows "english" (English_United States.1252) locale
        int_curr_symbol: 'USD',
        currency_symbol: '$',
        mon_decimal_point: '.',
        mon_thousands_sep: ',',
        mon_grouping: [3],
        // use mon_thousands_sep; "" for no grouping; additional array members indicate successive group lengths after first group (e.g., if to be 1,23,456, could be [3, 2])
        positive_sign: '',
        negative_sign: '-',
        int_frac_digits: 2,
        // Fractional digits only for money defaults?
        frac_digits: 2,
        p_cs_precedes: 1,
        // positive currency symbol follows value = 0; precedes value = 1
        p_sep_by_space: 0,
        // 0: no space between curr. symbol and value; 1: space sep. them unless symb. and sign are adjacent then space sep. them from value; 2: space sep. sign and value unless symb. and sign are adjacent then space separates
        n_cs_precedes: 1,
        // see p_cs_precedes
        n_sep_by_space: 0,
        // see p_sep_by_space
        p_sign_posn: 3,
        // 0: parentheses surround quantity and curr. symbol; 1: sign precedes them; 2: sign follows them; 3: sign immed. precedes curr. symbol; 4: sign immed. succeeds curr. symbol
        n_sign_posn: 0 // see p_sign_posn
      },
      'LC_NUMERIC': {
        // based on Windows "english" (English_United States.1252) locale
        decimal_point: '.',
        thousands_sep: ',',
        grouping: [3] // see mon_grouping, but for non-monetary values (use thousands_sep)
      },
      'LC_MESSAGES': {
        YESEXPR: '^[yY].*',
        NOEXPR: '^[nN].*',
        YESSTR: '',
        NOSTR: ''
      },
      nplurals: _nplurals2a
    }
    locutus.locales.en_US = _copy(locutus.locales.en)
    locutus.locales.en_US.LC_TIME.c = '%a %d %b %Y %r %Z'
    locutus.locales.en_US.LC_TIME.x = '%D'
    locutus.locales.en_US.LC_TIME.X = '%r'
    // The following are based on *nix settings
    locutus.locales.en_US.LC_MONETARY.int_curr_symbol = 'USD '
    locutus.locales.en_US.LC_MONETARY.p_sign_posn = 1
    locutus.locales.en_US.LC_MONETARY.n_sign_posn = 1
    locutus.locales.en_US.LC_MONETARY.mon_grouping = [3, 3]
    locutus.locales.en_US.LC_NUMERIC.thousands_sep = ''
    locutus.locales.en_US.LC_NUMERIC.grouping = []

    locutus.locales.en_GB = _copy(locutus.locales.en)
    locutus.locales.en_GB.LC_TIME.r = '%l:%M:%S %P %Z'

    locutus.locales.en_AU = _copy(locutus.locales.en_GB)
    // Assume C locale is like English (?) (We need C locale for LC_CTYPE)
    locutus.locales.C = _copy(locutus.locales.en)
    locutus.locales.C.LC_CTYPE.CODESET = 'ANSI_X3.4-1968'
    locutus.locales.C.LC_MONETARY = {
      int_curr_symbol: '',
      currency_symbol: '',
      mon_decimal_point: '',
      mon_thousands_sep: '',
      mon_grouping: [],
      p_cs_precedes: 127,
      p_sep_by_space: 127,
      n_cs_precedes: 127,
      n_sep_by_space: 127,
      p_sign_posn: 127,
      n_sign_posn: 127,
      positive_sign: '',
      negative_sign: '',
      int_frac_digits: 127,
      frac_digits: 127
    }
    locutus.locales.C.LC_NUMERIC = {
      decimal_point: '.',
      thousands_sep: '',
      grouping: []
    }
    // D_T_FMT
    locutus.locales.C.LC_TIME.c = '%a %b %e %H:%M:%S %Y'
    // D_FMT
    locutus.locales.C.LC_TIME.x = '%m/%d/%y'
    // T_FMT
    locutus.locales.C.LC_TIME.X = '%H:%M:%S'
    locutus.locales.C.LC_MESSAGES.YESEXPR = '^[yY]'
    locutus.locales.C.LC_MESSAGES.NOEXPR = '^[nN]'

    locutus.locales.fr = _copy(locutus.locales.en)
    locutus.locales.fr.nplurals = _nplurals2b
    locutus.locales.fr.LC_TIME.a = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
    locutus.locales.fr.LC_TIME.A = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    locutus.locales.fr.LC_TIME.b = ['jan', 'f\u00E9v', 'mar', 'avr', 'mai', 'jun', 'jui', 'ao\u00FB', 'sep', 'oct',
      'nov', 'd\u00E9c'
    ]
    locutus.locales.fr.LC_TIME.B = ['janvier', 'f\u00E9vrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'ao\u00FBt',
      'septembre', 'octobre', 'novembre', 'd\u00E9cembre'
    ]
    locutus.locales.fr.LC_TIME.c = '%a %d %b %Y %T %Z'
    locutus.locales.fr.LC_TIME.p = ['', '']
    locutus.locales.fr.LC_TIME.P = ['', '']
    locutus.locales.fr.LC_TIME.x = '%d.%m.%Y'
    locutus.locales.fr.LC_TIME.X = '%T'

    locutus.locales.fr_CA = _copy(locutus.locales.fr)
    locutus.locales.fr_CA.LC_TIME.x = '%Y-%m-%d'
  }
  if (!locutus.locale) {
    locutus.locale = 'en_US'
    var NS_XHTML = 'http://www.w3.org/1999/xhtml'
    var NS_XML = 'http://www.w3.org/XML/1998/namespace'
    if (d.getElementsByTagNameNS && d.getElementsByTagNameNS(NS_XHTML, 'html')[0]) {
      if (d.getElementsByTagNameNS(NS_XHTML, 'html')[0].getAttributeNS && d.getElementsByTagNameNS(NS_XHTML,
          'html')[0].getAttributeNS(NS_XML, 'lang')) {
        locutus.locale = d.getElementsByTagName(NS_XHTML, 'html')[0].getAttributeNS(NS_XML, 'lang')
      } else if (d.getElementsByTagNameNS(NS_XHTML, 'html')[0].lang) {
        // XHTML 1.0 only
        locutus.locale = d.getElementsByTagNameNS(NS_XHTML, 'html')[0].lang
      }
    } else if (d.getElementsByTagName('html')[0] && d.getElementsByTagName('html')[0].lang) {
      locutus.locale = d.getElementsByTagName('html')[0].lang
    }
  }
  // PHP-style
  locutus.locale = locutus.locale.replace('-', '_')
  // Fix locale if declared locale hasn't been defined
  if (!(locutus.locale in locutus.locales)) {
    if (locutus.locale.replace(/_[a-zA-Z]+$/, '') in locutus.locales) {
      locutus.locale = locutus.locale.replace(/_[a-zA-Z]+$/, '')
    }
  }

  if (!locutus.localeCategories) {
    locutus.localeCategories = {
      'LC_COLLATE': locutus.locale,
      // for string comparison, see strcoll()
      'LC_CTYPE': locutus.locale,
      // for character classification and conversion, for example strtoupper()
      'LC_MONETARY': locutus.locale,
      // for localeconv()
      'LC_NUMERIC': locutus.locale,
      // for decimal separator (See also localeconv())
      'LC_TIME': locutus.locale,
      // for date and time formatting with strftime()
      'LC_MESSAGES': locutus.locale // for system responses (available if PHP was compiled with libintl)
    }
  }
  // END REDUNDANT
  if (locale === null || locale === '') {
    locale = this.getenv(category) || this.getenv('LANG')
  } else if (Object.prototype.toString.call(locale) === '[object Array]') {
    for (i = 0; i < locale.length; i++) {
      if (!(locale[i] in this.php_js.locales)) {
        if (i === locale.length - 1) {
          // none found
          return false
        }
        continue
      }
      locale = locale[i]
      break
    }
  }

  // Just get the locale
  if (locale === '0' || locale === 0) {
    if (category === 'LC_ALL') {
      for (categ in this.php_js.localeCategories) {
        // Add ".UTF-8" or allow ".@latint", etc. to the end?
        cats.push(categ + '=' + this.php_js.localeCategories[categ])
      }
      return cats.join(';')
    }
    return this.php_js.localeCategories[category]
  }

  if (!(locale in this.php_js.locales)) {
    // Locale not found
    return false
  }

  // Set and get locale
  if (category === 'LC_ALL') {
    for (categ in this.php_js.localeCategories) {
      this.php_js.localeCategories[categ] = locale
    }
  } else {
    this.php_js.localeCategories[category] = locale
  }
  return locale
}