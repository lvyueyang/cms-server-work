import { StringKeys } from '../content_translation/content_translation.service';
import { DictValue } from './dict_value.entity';

export const DICT_VALUE_I18N_KEY = 'dict_value';
export const DICT_VALUE_I18N_FIELDS: StringKeys<DictValue>[] = ['label', 'desc', 'attr'];
