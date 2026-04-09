import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export interface Country {
  name: string;
  code: string;      // ISO 3166-1 alpha-2
  dial: string;      // e.g. "+1"
  flag: string;      // emoji
  pattern: RegExp;   // phone number pattern (digits only after dial code)
  example: string;   // human-readable example
  maxLen: number;    // max digits after country code
  minLen: number;
}

@Injectable({ providedIn: 'root' })
export class CountryService {
  readonly countries: Country[] = [
    { name:'United States',       code:'US', dial:'+1',    flag:'🇺🇸', pattern:/^[2-9]\d{9}$/,       example:'2025551234',   minLen:10, maxLen:10 },
    { name:'United Kingdom',      code:'GB', dial:'+44',   flag:'🇬🇧', pattern:/^[1-9]\d{9,10}$/,    example:'7400123456',   minLen:10, maxLen:11 },
    { name:'India',               code:'IN', dial:'+91',   flag:'🇮🇳', pattern:/^[6-9]\d{9}$/,        example:'9876543210',   minLen:10, maxLen:10 },
    { name:'Canada',              code:'CA', dial:'+1',    flag:'🇨🇦', pattern:/^[2-9]\d{9}$/,        example:'4165551234',   minLen:10, maxLen:10 },
    { name:'Australia',           code:'AU', dial:'+61',   flag:'🇦🇺', pattern:/^[24578]\d{8}$/,      example:'412345678',    minLen:9,  maxLen:9  },
    { name:'Germany',             code:'DE', dial:'+49',   flag:'🇩🇪', pattern:/^[1-9]\d{9,12}$/,    example:'15123456789',  minLen:10, maxLen:13 },
    { name:'France',              code:'FR', dial:'+33',   flag:'🇫🇷', pattern:/^[67]\d{8}$/,         example:'612345678',    minLen:9,  maxLen:9  },
    { name:'UAE',                 code:'AE', dial:'+971',  flag:'🇦🇪', pattern:/^[5]\d{8}$/,          example:'501234567',    minLen:9,  maxLen:9  },
    { name:'Saudi Arabia',        code:'SA', dial:'+966',  flag:'🇸🇦', pattern:/^[5]\d{8}$/,          example:'512345678',    minLen:9,  maxLen:9  },
    { name:'Pakistan',            code:'PK', dial:'+92',   flag:'🇵🇰', pattern:/^[3]\d{9}$/,          example:'3001234567',   minLen:10, maxLen:10 },
    { name:'Bangladesh',          code:'BD', dial:'+880',  flag:'🇧🇩', pattern:/^[1]\d{9}$/,          example:'1712345678',   minLen:10, maxLen:10 },
    { name:'Nigeria',             code:'NG', dial:'+234',  flag:'🇳🇬', pattern:/^[789]\d{9}$/,        example:'8012345678',   minLen:10, maxLen:10 },
    { name:'South Africa',        code:'ZA', dial:'+27',   flag:'🇿🇦', pattern:/^[678]\d{8}$/,        example:'712345678',    minLen:9,  maxLen:9  },
    { name:'Singapore',           code:'SG', dial:'+65',   flag:'🇸🇬', pattern:/^[689]\d{7}$/,        example:'81234567',     minLen:8,  maxLen:8  },
    { name:'New Zealand',         code:'NZ', dial:'+64',   flag:'🇳🇿', pattern:/^[2-9]\d{7,9}$/,     example:'211234567',    minLen:8,  maxLen:10 },
    { name:'Ireland',             code:'IE', dial:'+353',  flag:'🇮🇪', pattern:/^[89]\d{8}$/,         example:'812345678',    minLen:9,  maxLen:9  },
    { name:'Netherlands',         code:'NL', dial:'+31',   flag:'🇳🇱', pattern:/^[6]\d{8}$/,          example:'612345678',    minLen:9,  maxLen:9  },
    { name:'Sweden',              code:'SE', dial:'+46',   flag:'🇸🇪', pattern:/^[7]\d{8,9}$/,        example:'712345678',    minLen:9,  maxLen:10 },
    { name:'Norway',              code:'NO', dial:'+47',   flag:'🇳🇴', pattern:/^[49]\d{7}$/,         example:'41234567',     minLen:8,  maxLen:8  },
    { name:'Denmark',             code:'DK', dial:'+45',   flag:'🇩🇰', pattern:/^\d{8}$/,             example:'20123456',     minLen:8,  maxLen:8  },
    { name:'Italy',               code:'IT', dial:'+39',   flag:'🇮🇹', pattern:/^[3]\d{9}$/,          example:'3123456789',   minLen:10, maxLen:10 },
    { name:'Spain',               code:'ES', dial:'+34',   flag:'🇪🇸', pattern:/^[6789]\d{8}$/,       example:'612345678',    minLen:9,  maxLen:9  },
    { name:'Portugal',            code:'PT', dial:'+351',  flag:'🇵🇹', pattern:/^[29]\d{8}$/,         example:'912345678',    minLen:9,  maxLen:9  },
    { name:'Brazil',              code:'BR', dial:'+55',   flag:'🇧🇷', pattern:/^[1-9]\d{10}$/,       example:'11912345678',  minLen:11, maxLen:11 },
    { name:'Mexico',              code:'MX', dial:'+52',   flag:'🇲🇽', pattern:/^[1-9]\d{9}$/,        example:'5512345678',   minLen:10, maxLen:10 },
    { name:'Argentina',           code:'AR', dial:'+54',   flag:'🇦🇷', pattern:/^[1-9]\d{9}$/,        example:'1123456789',   minLen:10, maxLen:10 },
    { name:'Chile',               code:'CL', dial:'+56',   flag:'🇨🇱', pattern:/^[9]\d{8}$/,          example:'912345678',    minLen:9,  maxLen:9  },
    { name:'Colombia',            code:'CO', dial:'+57',   flag:'🇨🇴', pattern:/^[3]\d{9}$/,          example:'3123456789',   minLen:10, maxLen:10 },
    { name:'Malaysia',            code:'MY', dial:'+60',   flag:'🇲🇾', pattern:/^[1]\d{8,9}$/,        example:'112345678',    minLen:9,  maxLen:10 },
    { name:'Philippines',         code:'PH', dial:'+63',   flag:'🇵🇭', pattern:/^[9]\d{9}$/,          example:'9171234567',   minLen:10, maxLen:10 },
    { name:'Indonesia',           code:'ID', dial:'+62',   flag:'🇮🇩', pattern:/^[8]\d{8,11}$/,       example:'81234567890',  minLen:9,  maxLen:12 },
    { name:'Thailand',            code:'TH', dial:'+66',   flag:'🇹🇭', pattern:/^[689]\d{8}$/,        example:'812345678',    minLen:9,  maxLen:9  },
    { name:'Vietnam',             code:'VN', dial:'+84',   flag:'🇻🇳', pattern:/^[3-9]\d{8}$/,        example:'912345678',    minLen:9,  maxLen:9  },
    { name:'South Korea',         code:'KR', dial:'+82',   flag:'🇰🇷', pattern:/^[1][0-9]\d{7,8}$/,  example:'1012345678',   minLen:9,  maxLen:10 },
    { name:'Japan',               code:'JP', dial:'+81',   flag:'🇯🇵', pattern:/^[789]\d{8,9}$/,      example:'9012345678',   minLen:9,  maxLen:10 },
    { name:'China',               code:'CN', dial:'+86',   flag:'🇨🇳', pattern:/^[1][3-9]\d{9}$/,     example:'13812345678',  minLen:11, maxLen:11 },
    { name:'Kenya',               code:'KE', dial:'+254',  flag:'🇰🇪', pattern:/^[7]\d{8}$/,          example:'712345678',    minLen:9,  maxLen:9  },
    { name:'Ghana',               code:'GH', dial:'+233',  flag:'🇬🇭', pattern:/^[235]\d{8}$/,        example:'231234567',    minLen:9,  maxLen:9  },
    { name:'Egypt',               code:'EG', dial:'+20',   flag:'🇪🇬', pattern:/^[1]\d{9}$/,          example:'1001234567',   minLen:10, maxLen:10 },
    { name:'Qatar',               code:'QA', dial:'+974',  flag:'🇶🇦', pattern:/^[3567]\d{7}$/,       example:'33123456',     minLen:8,  maxLen:8  },
    { name:'Kuwait',              code:'KW', dial:'+965',  flag:'🇰🇼', pattern:/^[569]\d{7}$/,        example:'50123456',     minLen:8,  maxLen:8  },
    { name:'Bahrain',             code:'BH', dial:'+973',  flag:'🇧🇭', pattern:/^[369]\d{7}$/,        example:'36123456',     minLen:8,  maxLen:8  },
    { name:'Oman',                code:'OM', dial:'+968',  flag:'🇴🇲', pattern:/^[79]\d{7}$/,         example:'71234567',     minLen:8,  maxLen:8  },
    { name:'Jordan',              code:'JO', dial:'+962',  flag:'🇯🇴', pattern:/^[7]\d{8}$/,          example:'791234567',    minLen:9,  maxLen:9  },
    { name:'Turkey',              code:'TR', dial:'+90',   flag:'🇹🇷', pattern:/^[5]\d{9}$/,          example:'5321234567',   minLen:10, maxLen:10 },
    { name:'Switzerland',         code:'CH', dial:'+41',   flag:'🇨🇭', pattern:/^[7][5-9]\d{7}$/,     example:'791234567',    minLen:9,  maxLen:9  },
    { name:'Belgium',             code:'BE', dial:'+32',   flag:'🇧🇪', pattern:/^[4]\d{8}$/,          example:'470123456',    minLen:9,  maxLen:9  },
    { name:'Austria',             code:'AT', dial:'+43',   flag:'🇦🇹', pattern:/^[6]\d{10,12}$/,      example:'66412345678',  minLen:11, maxLen:13 },
    { name:'Poland',              code:'PL', dial:'+48',   flag:'🇵🇱', pattern:/^[4-9]\d{8}$/,        example:'512345678',    minLen:9,  maxLen:9  },
    { name:'Russia',              code:'RU', dial:'+7',    flag:'🇷🇺', pattern:/^[9]\d{9}$/,          example:'9123456789',   minLen:10, maxLen:10 },
    { name:'Ukraine',             code:'UA', dial:'+380',  flag:'🇺🇦', pattern:/^[6789]\d{8}$/,       example:'671234567',    minLen:9,  maxLen:9  },
    { name:'Greece',              code:'GR', dial:'+30',   flag:'🇬🇷', pattern:/^[6]\d{9}$/,          example:'6912345678',   minLen:10, maxLen:10 },
    { name:'Czech Republic',      code:'CZ', dial:'+420',  flag:'🇨🇿', pattern:/^[1-9]\d{8}$/,        example:'601123456',    minLen:9,  maxLen:9  },
    { name:'Hungary',             code:'HU', dial:'+36',   flag:'🇭🇺', pattern:/^[23][0-9]\d{7}$/,    example:'201234567',    minLen:9,  maxLen:9  },
    { name:'Romania',             code:'RO', dial:'+40',   flag:'🇷🇴', pattern:/^[7]\d{8}$/,          example:'721123456',    minLen:9,  maxLen:9  },
    { name:'Sri Lanka',           code:'LK', dial:'+94',   flag:'🇱🇰', pattern:/^[7]\d{8}$/,          example:'712345678',    minLen:9,  maxLen:9  },
    { name:'Nepal',               code:'NP', dial:'+977',  flag:'🇳🇵', pattern:/^[9][7-8]\d{8}$/,     example:'9841234567',   minLen:10, maxLen:10 },
    { name:'Ethiopia',            code:'ET', dial:'+251',  flag:'🇪🇹', pattern:/^[9]\d{8}$/,          example:'911234567',    minLen:9,  maxLen:9  },
    { name:'Tanzania',            code:'TZ', dial:'+255',  flag:'🇹🇿', pattern:/^[67]\d{8}$/,         example:'712345678',    minLen:9,  maxLen:9  },
    { name:'Uganda',              code:'UG', dial:'+256',  flag:'🇺🇬', pattern:/^[7]\d{8}$/,          example:'712345678',    minLen:9,  maxLen:9  },
    { name:'Zimbabwe',            code:'ZW', dial:'+263',  flag:'🇿🇼', pattern:/^[7]\d{8}$/,          example:'712345678',    minLen:9,  maxLen:9  },
    { name:'Zambia',              code:'ZM', dial:'+260',  flag:'🇿🇲', pattern:/^[97]\d{8}$/,         example:'971234567',    minLen:9,  maxLen:9  },
    { name:'Jamaica',             code:'JM', dial:'+1876', flag:'🇯🇲', pattern:/^\d{7}$/,             example:'2101234',      minLen:7,  maxLen:7  },
    { name:'Trinidad & Tobago',   code:'TT', dial:'+1868', flag:'🇹🇹', pattern:/^\d{7}$/,             example:'2991234',      minLen:7,  maxLen:7  },
    { name:'Barbados',            code:'BB', dial:'+1246', flag:'🇧🇧', pattern:/^\d{7}$/,             example:'2301234',      minLen:7,  maxLen:7  },
    { name:'Guyana',              code:'GY', dial:'+592',  flag:'🇬🇾', pattern:/^\d{7}$/,             example:'6001234',      minLen:7,  maxLen:7  },
    { name:'Peru',                code:'PE', dial:'+51',   flag:'🇵🇪', pattern:/^[9]\d{8}$/,          example:'912345678',    minLen:9,  maxLen:9  },
    { name:'Venezuela',           code:'VE', dial:'+58',   flag:'🇻🇪', pattern:/^[4]\d{10}$/,         example:'41212345678',  minLen:11, maxLen:11 },
    { name:'Ecuador',             code:'EC', dial:'+593',  flag:'🇪🇨', pattern:/^[9]\d{8}$/,          example:'991234567',    minLen:9,  maxLen:9  },
    { name:'Bolivia',             code:'BO', dial:'+591',  flag:'🇧🇴', pattern:/^[67]\d{7}$/,         example:'71234567',     minLen:8,  maxLen:8  },
    { name:'Paraguay',            code:'PY', dial:'+595',  flag:'🇵🇾', pattern:/^[9]\d{8}$/,          example:'981234567',    minLen:9,  maxLen:9  },
    { name:'Uruguay',             code:'UY', dial:'+598',  flag:'🇺🇾', pattern:/^[9]\d{7}$/,          example:'91234567',     minLen:8,  maxLen:8  },
    { name:'Morocco',             code:'MA', dial:'+212',  flag:'🇲🇦', pattern:/^[67]\d{8}$/,         example:'612345678',    minLen:9,  maxLen:9  },
    { name:'Tunisia',             code:'TN', dial:'+216',  flag:'🇹🇳', pattern:/^[2-9]\d{7}$/,        example:'20123456',     minLen:8,  maxLen:8  },
    { name:'Algeria',             code:'DZ', dial:'+213',  flag:'🇩🇿', pattern:/^[5-7]\d{8}$/,        example:'551234567',    minLen:9,  maxLen:9  },
    { name:'Ivory Coast',         code:'CI', dial:'+225',  flag:'🇨🇮', pattern:/^\d{10}$/,            example:'0712345678',   minLen:10, maxLen:10 },
    { name:'Cameroon',            code:'CM', dial:'+237',  flag:'🇨🇲', pattern:/^[6]\d{8}$/,          example:'612345678',    minLen:9,  maxLen:9  },
    { name:'Senegal',             code:'SN', dial:'+221',  flag:'🇸🇳', pattern:/^[7]\d{8}$/,          example:'771234567',    minLen:9,  maxLen:9  },
    { name:'Finland',             code:'FI', dial:'+358',  flag:'🇫🇮', pattern:/^[4-9]\d{7,9}$/,      example:'412345678',    minLen:8,  maxLen:10 },
    { name:'Israel',              code:'IL', dial:'+972',  flag:'🇮🇱', pattern:/^[5]\d{8}$/,          example:'521234567',    minLen:9,  maxLen:9  },
    { name:'Iran',                code:'IR', dial:'+98',   flag:'🇮🇷', pattern:/^[9]\d{9}$/,          example:'9121234567',   minLen:10, maxLen:10 },
    { name:'Iraq',                code:'IQ', dial:'+964',  flag:'🇮🇶', pattern:/^[7]\d{9}$/,          example:'7901234567',   minLen:10, maxLen:10 },
    { name:'Lebanon',             code:'LB', dial:'+961',  flag:'🇱🇧', pattern:/^[3][0-9]\d{6}$/,     example:'31123456',     minLen:8,  maxLen:8  },
    { name:'Libya',               code:'LY', dial:'+218',  flag:'🇱🇾', pattern:/^[9]\d{8}$/,          example:'912345678',    minLen:9,  maxLen:9  },
    { name:'Sudan',               code:'SD', dial:'+249',  flag:'🇸🇩', pattern:/^[9]\d{8}$/,          example:'912345678',    minLen:9,  maxLen:9  },
    { name:'Myanmar',             code:'MM', dial:'+95',   flag:'🇲🇲', pattern:/^[9]\d{7,9}$/,        example:'912345678',    minLen:8,  maxLen:10 },
    { name:'Cambodia',            code:'KH', dial:'+855',  flag:'🇰🇭', pattern:/^[1-9]\d{7,8}$/,      example:'12345678',     minLen:8,  maxLen:9  },
    { name:'Laos',                code:'LA', dial:'+856',  flag:'🇱🇦', pattern:/^[2]\d{9}$/,          example:'2012345678',   minLen:10, maxLen:10 },
    { name:'Mongolia',            code:'MN', dial:'+976',  flag:'🇲🇳', pattern:/^[89]\d{7}$/,         example:'88123456',     minLen:8,  maxLen:8  },
    { name:'Kazakhstan',          code:'KZ', dial:'+7',    flag:'🇰🇿', pattern:/^[7]\d{9}$/,          example:'7012345678',   minLen:10, maxLen:10 },
    { name:'Armenia',             code:'AM', dial:'+374',  flag:'🇦🇲', pattern:/^[7]\d{7}$/,          example:'77123456',     minLen:8,  maxLen:8  },
    { name:'Georgia',             code:'GE', dial:'+995',  flag:'🇬🇪', pattern:/^[5]\d{8}$/,          example:'555123456',    minLen:9,  maxLen:9  },
    { name:'Azerbaijan',          code:'AZ', dial:'+994',  flag:'🇦🇿', pattern:/^[5][0-9]\d{7}$/,     example:'501234567',    minLen:9,  maxLen:9  },
    { name:'Uzbekistan',          code:'UZ', dial:'+998',  flag:'🇺🇿', pattern:/^[9]\d{8}$/,          example:'901234567',    minLen:9,  maxLen:9  },
    { name:'Other',               code:'XX', dial:'+0',    flag:'🌍', pattern:/^\d{4,15}$/,            example:'1234567890',   minLen:4,  maxLen:15 },
  ];

  getByCode(code: string): Country {
    return this.countries.find(c => c.code === code) || this.countries[0];
  }

  /** Angular reactive form validator — pass selectedCountry signal */
  phoneValidator(getCountry: () => Country): ValidatorFn {
    return (ctrl: AbstractControl) => {
      const val = (ctrl.value || '').replace(/[\s\-\(\)]/g, '');
      if (!val) return null; // required handled separately
      const country = getCountry();
      if (!country.pattern.test(val)) {
        return { invalidPhone: { example: country.example, dial: country.dial } };
      }
      return null;
    };
  }

  /** Strip non-digits for storage */
  cleanPhone(val: string): string {
    return val.replace(/[^\d]/g, '');
  }
}
