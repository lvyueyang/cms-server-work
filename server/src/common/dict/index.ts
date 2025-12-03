import { DictType } from '@/modules/dict_type/dict_type.entity';
import { DictValue } from '@/modules/dict_value/dict_value.entity';

export interface DictPreset extends Pick<DictType, 'name' | 'type' | 'desc'> {
  values: (Pick<DictValue, 'label' | 'value'> & Partial<Pick<DictValue, 'attr' | 'desc'>>)[];
}

// 预置的字典
export const DICT_PRESET: DictPreset[] = [
  // {
  //   name: '产品类型',
  //   type: 'product_type',
  //   desc: '',
  //   values: [
  //     {
  //       label: 'A',
  //       value: 'a',
  //     },
  //   ],
  // },
];
