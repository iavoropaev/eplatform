import { useEffect, useState } from "react";
import { getCollections } from "../../server/collections";
import { NavLink } from "react-router-dom";

const CollectionCatalog = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const collectionsFromServer = await getCollections();
      setCollections(collectionsFromServer);
    }
    fetchData();
  }, []);
  return (
    <>
      <h1>Каталог</h1>
      {collections.map((col) => {
        return (
          <p key={col.slug}>
            <NavLink to={`./${col.slug}/`}>{col.name}</NavLink>
          </p>
        );
      })}
    </>
  );
};

export default CollectionCatalog;
