import { Uri } from "../";
import { UriConfig } from "../types/Uri";

describe("Uri", () => {
  it("Inserts a wrap:// scheme when one is not present", () => {
    const uri = new Uri("/authority-v2/path.to.thing.root/sub/path");

    expect(uri.uri).toEqual("wrap://authority-v2/path.to.thing.root/sub/path");
    expect(uri.authority).toEqual("authority-v2");
    expect(uri.path).toEqual("path.to.thing.root/sub/path");
  });

  it("isUri fails when given something that's not a URI", () => {
    expect(Uri.isUri("not a Uri object" as never)).toBeFalsy();
  });

  it("Fails if an authority is not present", () => {
    expect(() => new Uri("wrap://path")).toThrowError(/URI is malformed,/);
  });

  it("Fails if a path is not present", () => {
    expect(() => new Uri("wrap://authority/")).toThrowError(/URI is malformed,/);
  });

  it("Fails if scheme is not at the beginning", () => {
    expect(() => new Uri("path/wrap://something")).toThrowError(
      /The wrap:\/\/ scheme must/
    );
  });

  it("Fails with an empty string", () => {
    expect(() => new Uri("")).toThrowError("The provided URI is empty");
  });

  it("Returns true if URI is valid", () => {
    expect(Uri.isValidUri("wrap://valid/uri")).toBeTruthy();
  });

  it("Returns false if URI is invalid", () => {
    expect(Uri.isValidUri("wrap://.....")).toBeFalsy();
  });

  it("Returns a parsed URI configuration from isValidUri", () => {
    const config: UriConfig = {} as UriConfig;

    expect(Uri.isValidUri("wrap://valid/uri", config)).toBeTruthy();
    expect(config).toMatchObject({
      uri: "wrap://valid/uri",
      authority: "valid",
      path: "uri",
    });
  });
});
