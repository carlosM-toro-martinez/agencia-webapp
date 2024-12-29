import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const ventasPorPagarService = async () => {
  return await get(`${buildApiUri()}/v1/reportes/ventas/por_pagar`);
};
export default ventasPorPagarService;
