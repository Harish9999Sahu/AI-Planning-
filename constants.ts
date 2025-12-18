import { PermissibleWorkDef } from './types';

export const PERMISSIBLE_WORKS_DB: PermissibleWorkDef[] = [
  { seq: 34, master_category_code: "A", work_type: "Check Dams", permissible_work: "Construction of Earthen Gully Plugs for Individuals", gaw_status: "GAW", sub_category_id: 9096 },
  { seq: 21, master_category_code: "A", work_type: "Bunds", permissible_work: "Construction of Pebble graded Bund for Community", gaw_status: "GAW", sub_category_id: 2069 },
  { seq: 76, master_category_code: "A", work_type: "Recharge structure", permissible_work: "Construction of Sand filter for openwell recharge for Groups", gaw_status: "Non-GAW", sub_category_id: 2095 },
  { seq: 112, master_category_code: "B", work_type: "Plantation", permissible_work: "Wastelands Block Plantation of Forestry Trees for Individuals", gaw_status: "GAW", sub_category_id: 9054 },
  { seq: 7, master_category_code: "B", work_type: "Ponds", permissible_work: "Construction of Fisheries Ponds for Community", gaw_status: "GAW", sub_category_id: 11006 },
  { seq: 183, master_category_code: "A", work_type: "Ponds", permissible_work: "Construction of Community Water Harvesting Ponds", gaw_status: "GAW", sub_category_id: 2076 },
  { seq: 95, master_category_code: "A", work_type: "Check Dams", permissible_work: "Construction of Gabion Check Dam for Community", gaw_status: "GAW", sub_category_id: 2105 },
  { seq: 4, master_category_code: "A", work_type: "Plantation", permissible_work: "Block Plantation of Sericulture Trees in Fields for Community", gaw_status: "GAW", sub_category_id: 15134 },
  { seq: 19, master_category_code: "A", work_type: "Plantation", permissible_work: "Road side line plantation of Forestry Trees for Community", gaw_status: "Non-GAW", sub_category_id: 15022 },
  { seq: 153, master_category_code: "A", work_type: "Bench Terrace", permissible_work: "Construction of Upland Bench Terrace for Individual", gaw_status: "GAW", sub_category_id: 9078 },
  { seq: 191, master_category_code: "A", work_type: "Trenches", permissible_work: "Construction of Continuous Contour Trench for Community", gaw_status: "GAW", sub_category_id: 2115 },
  { seq: 106, master_category_code: "D", work_type: "Storm water drains", permissible_work: "Repair and maintenance of intermediate and Link Storm Water Drain for Community", gaw_status: "Non-GAW", sub_category_id: 12016 },
  { seq: 101, master_category_code: "D", work_type: "Embankment", permissible_work: "Construction of Earthen Spur for Community", gaw_status: "Non-GAW", sub_category_id: 2073 }
];

export const MOCK_GP_BOUNDARY = [
  { lat: 17.33, lng: 76.83 },
  { lat: 17.35, lng: 76.84 },
  { lat: 17.36, lng: 76.88 },
  { lat: 17.34, lng: 76.90 },
  { lat: 17.32, lng: 76.87 },
  { lat: 17.31, lng: 76.84 },
  { lat: 17.33, lng: 76.83 }
];

export const DEFAULT_CENTER = { lat: 17.335, lng: 76.86 };