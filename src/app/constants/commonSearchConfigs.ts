import type { CommonSearchBaseParams } from '@/services/commonSearch'

export const COMMON_SEARCH_CONFIGS = {
  menuDisplayName: {
    schemaName: 's_master',
    tableName: 'm_menu',
    columnId: 'menu_id',
    displayColumns: 'display_name',
    displayName: 'display_name',
    otherCondition: '1=1',
    sortBy: 'menu_id',
  }
} as const satisfies Record<string, CommonSearchBaseParams>
