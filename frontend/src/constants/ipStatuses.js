export const IP_STATUSES = {
  FILED: 'Filed',
  UNDER_EXAMINATION: 'Under Examination',
  GRANTED: 'Granted',
  REJECTED: 'Rejected',
  ABANDONED: 'Abandoned',
  PENDING_REVIEW: 'Pending Review'
};

export const STATUS_COLORS = {
  [IP_STATUSES.FILED]: '#06B6D4',
  [IP_STATUSES.UNDER_EXAMINATION]: '#F59E0B',
  [IP_STATUSES.GRANTED]: '#10B981',
  [IP_STATUSES.REJECTED]: '#EF4444',
  [IP_STATUSES.ABANDONED]: '#6B7280',
  [IP_STATUSES.PENDING_REVIEW]: '#8B5CF6'
};

export const STATUS_TOOLTIPS = {
  [IP_STATUSES.FILED]: 'Application submitted and awaiting initial review',
  [IP_STATUSES.UNDER_EXAMINATION]: 'Patent examiner reviewing for patentability',
  [IP_STATUSES.GRANTED]: 'Patent/trademark approved and rights are active',
  [IP_STATUSES.REJECTED]: 'Application denied by patent office',
  [IP_STATUSES.ABANDONED]: 'Application withdrawn or allowed to lapse',
  [IP_STATUSES.PENDING_REVIEW]: 'In queue or awaiting response to office action'
};