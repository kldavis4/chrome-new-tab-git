import dynamic from "next/dynamic";
import { TinaEditProvider } from "tinacms/dist/edit-state";
import { RouteMappingPlugin } from "tinacms";

// @ts-ignore FIXME: default export needs to be 'ComponentType<{}>
const TinaCMS = dynamic(() => import("tinacms"), { ssr: false });

const branch = "main";
// When working locally, hit our local filesystem.
// On a Vercel deployment, hit the Tina Cloud API
const apiURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:4001/graphql"
    : `https://content.tinajs.io/content/${process.env.NEXT_PUBLIC_TINA_CLIENT_ID}/github/${branch}`;

const App = ({ Component, pageProps }) => {
  return (
    <>
      <TinaEditProvider
        showEditButton={true}
        editMode={
          <TinaCMS
           apiURL={apiURL}
           cmsCallback={(cms) => {
              const RouteMapping = new RouteMappingPlugin(
                (collection, document) => {
                  if (["bookmarks"].includes(collection.name)) {
                    return undefined;
                  }
                  /**
                   * While the `pages` collection does have dedicated pages,
                   * their URLs are different than their document names.
                   **/
                  if (["pages"].includes(collection.name)) {
                    if (document.sys.filename === "home") {
                      return `/`;
                    }
                    return undefined;
                  }
                  /**
                   * Finally, any other collections (`posts`, for example)
                   * have URLs based on values in the `collection` and `document`.
                   **/
                  return `/${collection.name}/${document.sys.filename}`;
                }
              );


              /**
               * Enables experimental branch switcher
               */
              cms.flags.set("branch-switcher", true);

              /**
               * Enables `tina-admin` specific features in the Tina Sidebar
               */
              cms.flags.set("tina-admin", true);

              return cms;
            }}
            formifyCallback={({ formConfig, createForm, createGlobalForm }) => {
              if (formConfig.id === "getGlobalDocument") {
                return createGlobalForm(formConfig);
              }

              return createForm(formConfig);
            }}
           >
            <Component {...pageProps} />
          </TinaCMS>
        }
      >
        <Component {...pageProps} />
      </TinaEditProvider>
    </>
  );
};

export default App;
