import { useEffect } from 'react'
import { staticRequest } from "tinacms";
import { Layout } from "../components/Layout";
import { useTina } from "tinacms/dist/edit-state";
import Link from "next/link";

const query = `{
  getBookmarksList{
    edges {
      node {
        data {
          keyBinding
          title
          url          
        }
      }
    }
  }
}`;

export default function Home(props) {
  // data passes though in production mode and data is updated to the sidebar data in edit-mode
  const { data } = useTina({
    query,
    variables: {},
    data: props.data,
  });

  const bookmarksList = data.getBookmarksList.edges;
  const codeToUrl = {}

  if (data) {
    for (let bookmark of bookmarksList) {
      if (bookmark.node.data.keyBinding) {
        codeToUrl[bookmark.node.data.keyBinding] = bookmark.node.data.url
      }
    }
  }

  useEffect(function onFirstMount() {
    function handleOnKeyDown(evt) {
      const url = codeToUrl[evt.key]
      if (url) {
        // TODO flash a confirmation here
        window.location.href = url
      }
    }

    window.addEventListener("keydown", handleOnKeyDown);
  }, []); // empty dependencies array means "run this once on first mount"

  return (
    <Layout>
      <div>
        {bookmarksList.map((bookmark) => (
          <div key={bookmark.node.id}>
            <Link href={bookmark.node.data.url}>
              <a>{bookmark.node.data.keyBinding} - {bookmark.node.data.title}</a>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const variables = {};
  let data = {};
  try {
    data = await staticRequest({
      query,
      variables,
    });
  } catch (e) {
    // swallow errors related to document creation
    console.log(e)
  }

  return {
    props: {
      data,
      //myOtherProp: 'some-other-data',
    },
  };
};
