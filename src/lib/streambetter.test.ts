import { describe, expect, it } from "vitest";
import { buildStreamBetterUrl, isValidPlayerUrl, slugify } from "./streambetter";

describe("StreamBetter", () => {
  it("monta a URL do primeiro episódio", () => {
    expect(buildStreamBetterUrl(14713, 1, 1)).toBe("https://streambetter.lol/serie/14713/1/1");
  });
  it("monta o episódio seguinte", () => {
    expect(buildStreamBetterUrl(14713, 1, 2)).toBe("https://streambetter.lol/serie/14713/1/2");
  });
  it("monta a temporada seguinte", () => {
    expect(buildStreamBetterUrl(14713, 2, 1)).toBe("https://streambetter.lol/serie/14713/2/1");
  });
  it("rejeita TMDB ID inválido", () => {
    expect(() => buildStreamBetterUrl(0, 1, 1)).toThrow();
  });
  it("só aceita https", () => {
    expect(isValidPlayerUrl("http://x.com/a")).toBe(false);
    expect(isValidPlayerUrl("javascript:alert(1)")).toBe(false);
    expect(isValidPlayerUrl("https://streambetter.lol/serie/1/1/1")).toBe(true);
  });
  it("gera slug", () => {
    expect(slugify("Shingeki no Kyojin: Ação!")).toBe("shingeki-no-kyojin-acao");
  });
});
