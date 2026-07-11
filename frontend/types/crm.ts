export type CRMStatus = 'GOOD_LEAD_FOLLOW_UP' | 'DID_NOT_CONNECT' | 'BAD_LEAD' | 'SALE_DONE';

export type DataSource = 'leads_on_demand' | 'meridian_tower' | 'eden_park' | 'varah_swamy' | 'sarjapur_plots' | '';

export interface CRMRecord {
  _id?: string;
  batchId?: string;
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: CRMStatus;
  crm_note: string;
  data_source: DataSource;
  possession_time: string;
  description: string;
  insertedAt?: string;
  [key: string]: any;
}

export interface LeadItem {
  _id: string;
  batchId: string;
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: CRMStatus;
  crm_note: string;
  data_source: DataSource;
  possession_time: string;
  description: string;
  insertedAt: string;
}

export interface LeadsResponse {
  leads: LeadItem[];
  total: number;
  offset: number;
  limit: number;
}

export interface ImportBatch {
  _id: string;
  fileName: string;
  totalRows: number;
  totalImported: number;
  totalSkipped: number;
  createdAt: string;
}

export interface BatchesResponse {
  batches: ImportBatch[];
}

export interface ExtractResponse {
  imported: CRMRecord[];
  skipped: { row: any; reason: string }[];
  summary: {
    totalRows: number;
    importedCount: number;
    skippedCount: number;
  };
}
