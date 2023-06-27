pub mod wrap;
use wrap::{
    *,
    env::{Env},
    imported::{test_resolver_module}
};

impl ModuleTrait for Module {
    fn try_resolve_uri(
        args: ArgsTryResolveUri,
        _env: Option<Env>
    ) -> Result<Option<MaybeUriOrManifest>, String> {
        let result = TestResolverModule::try_resolve_uri(&test_resolver_module::ArgsTryResolveUri {
            authority: args.authority,
            path: args.path,
        });

        match result {
            Ok(result) => {
                match result {
                    Some(result) => {
                        return Ok(Some(MaybeUriOrManifest {
                            uri: result.uri,
                            manifest: result.manifest
                        }));
                    },
                    None => {
                        return Ok(None);
                    }
                }
            },
            Err(e) => {
                return Err(e);
            }
        }
    }

    fn get_file(
        _args: ArgsGetFile,
        _env: Option<Env>
    ) -> Result<Option<Vec<u8>>, String> {
        return Ok(None);
    }
}