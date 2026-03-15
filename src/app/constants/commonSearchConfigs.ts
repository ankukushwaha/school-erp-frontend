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
  },
  academicYear: {
    schemaName: 's_master',
    tableName: 'm_academic_year',
    columnId: 'academic_year_id',
    displayColumns: 'academic_year',
    displayName: 'academic_year',
    otherCondition: 'del_status = false',
    sortBy: 'academic_year_id',
  },
  className: {
    schemaName: 's_master',
    tableName: 'm_class',
    columnId: 'class_id',
    displayColumns: 'class_name,class_order',
    displayName: 'class_name',
    otherCondition: 'del_status = false',
    sortBy: 'class_id',
  },
  eventType: {
    schemaName: 's_master',
    tableName: 'm_event_type',
    columnId: 'event_type_id',
    displayColumns: 'event_type_name,description',
    displayName: 'event_type_name',
    otherCondition: 'del_status = false',
    sortBy: 'event_type_id',
  },
} as const satisfies Record<string, CommonSearchBaseParams>
