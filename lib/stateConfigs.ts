export const stateConfigs: {
  [key: string]: { tabName: string; tabColor: string; textColor?: string };
} = {
  VIC: {
    tabName: "Victoria",
    tabColor: "#1e384b",
    textColor: "#FFFFFF",
  }, // Dark Blue
  NSW: {
    tabName: "New South Wales",
    tabColor: "#a2dced",
    textColor: "#000000",
  }, // Light Blue
  QLD: { tabName: "Queensland", tabColor: "#a13d5e", textColor: "#FFFFFF" }, // Dark Red
  WA: {
    tabName: "Western Australia",
    tabColor: "#ffd530",
    textColor: "#000000",
  }, // Yellow
  SA: { tabName: "South Australia", tabColor: "#f04b4c", textColor: "#FFFFFF" }, // Red
  ACT: {
    tabName: "Australian Capital Territory",
    tabColor: "#ce509d",
    textColor: "#FFFFFF",
  }, // Pink
  TAS: { tabName: "Tasmania", tabColor: "#00a651", textColor: "#FFFFFF" }, // Green
  NT: {
    tabName: "Northern Territory",
    tabColor: "#f99d2a",
    textColor: "#FFFFFF",
  }, // Orange
};

export const getStateConfig = (state: string) => {
  const normalizedState = state.toUpperCase();
  return (
    stateConfigs[normalizedState] || {
      tabName: "Unknown",
      tabColor: "#000000",
      textColor: "#FFFFFF",
    }
  );
};

export const getAllStates = () => {
  return Object.entries(stateConfigs).map(([state, { tabName, tabColor }]) => ({
    value: state,
    label: tabName,
    tabColor: tabColor,
  }));
};
