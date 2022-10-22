const { getConfigPath, updateConfig, getConfig } = require("../src/config");
const { getUserHome } = require("../src/utils");

describe("Config tests", () => {
  const customConfigName = "test.json";

  test("Get config path", () => {
    expect(getConfigPath(customConfigName)).toBe(
      `${getUserHome()}/.config/${customConfigName}`
    );
  });

  test("Update config", () => {
    const newConfig = {
      nick: "test",
      location: "/home/user/twt.txt",
      url: "https://example.com/twt.txt",
      avatar: "https://example.com/avatar.jpg",
      description: "Test description",
      following: [{ nick: "follower", url: "https://follower.com/twt.txt" }],
    };
    const updatedConfig = updateConfig(newConfig, customConfigName);
    Object.keys(newConfig).forEach((key) => {
      expect(updatedConfig[key]).toBe(newConfig[key]);
    });
  });

  test("Get config", () => {
    const config = getConfig(customConfigName);
    expect(Object.keys(config).length).toBe(8);
    Object.keys(config).forEach((key) => {
      if (key !== "following") {
        expect(typeof config[key]).toBe("string");
      } else {
        expect(typeof config[key]).toBe("object");
        expect(typeof config[key].length).toBe("number");
      }
    });
  });
});
