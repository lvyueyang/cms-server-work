import { DictType } from '@/modules/dict_type/dict_type.entity';
import { DictValue } from '@/modules/dict_value/dict_value.entity';

export interface DictPreset extends Pick<DictType, 'name' | 'type' | 'desc'> {
  values: (Pick<DictValue, 'label' | 'value'> &
    Partial<Pick<DictValue, 'desc' | 'recommend' | 'attr_type'>> & {
      attr?: string | Record<string, unknown> | any[];
    })[];
}

// 预置的字典
export const DICT_PRESET: DictPreset[] = [
  {
    name: '广告位置',
    type: 'banner_position',
    desc: '',
    values: [
      {
        label: '首页顶部',
        value: 'home_top',
      },
    ],
  },
] as const;
