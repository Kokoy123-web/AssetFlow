import { state } from "./state.js";
import { loadPageData } from "./data-loader.js";
import { pages } from "../pages/pages.js";
import { $ } from "../utils/dom.js";
import { renderNavigation } from "../components/layout.js";
export async function renderPage() {
  const result = await loadPageData();
  if (result.equipmentError) throw result.equipmentError;
  if (result.requestError) throw result.requestError;
  renderNavigation();
  $("#content").innerHTML = pages[state.page]?.() || pages.dashboard();
}
