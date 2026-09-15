export const state = {
  user: null,
  profile: null,
  page: "dashboard",
  data: { equipment: [], requests: [], audit: [], users: [] },
};
export const role = () => state.profile?.role || "requester";
export const can = (...roles) => roles.includes(role());
