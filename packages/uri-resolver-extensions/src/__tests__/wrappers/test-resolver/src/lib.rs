pub mod wrap;
use wrap::{*,env::Env};

impl ModuleTrait for Module {
    fn try_resolve_uri(
        args: ArgsTryResolveUri,
        _env: Option<Env>
    ) -> Result<Option<MaybeUriOrManifest>, String> {
        if args.authority != "test" {
            return Ok(None);
        }

        match args.path.as_str() {
            "from" => Ok(Some(MaybeUriOrManifest {
                manifest: None,
                uri: Some("test/to".to_string())
            })),
            "package" => Ok(Some(MaybeUriOrManifest {
                manifest: Some(vec![0]),
                uri: None
            })),
            "error" => Err("Test error".to_string()),
            _ => Ok(None)
        }
    }

    fn get_file(
        _args: ArgsGetFile,
        _env: Option<Env>
    ) -> Result<Option<Vec<u8>>, String> {
        return Ok(None);
    }
}