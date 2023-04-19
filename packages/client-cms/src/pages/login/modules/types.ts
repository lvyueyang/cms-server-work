/** 概览数据 */
export interface OverFlowDataResult {
  /** 总数量 */
  total_equipment: number;
  /** 在线数量 */
  up_equipment: number;
  /** 离线数量 */
  down_equipment: number;
  /** 集群总数 */
  cluster_total: number;
  /** 集群在线数量 */
  cluster_up: number;
  /** 集群离线数量 */
  cluster_down: number;
}
