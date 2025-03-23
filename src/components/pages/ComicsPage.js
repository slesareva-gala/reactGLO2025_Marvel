import { Helmet } from "react-helmet";

import AppBanner from "../appBanner/AppBanner";
import CommicList from "../comicsList/ComicsList";

const ComicsPage = () => {

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Page with list of Marvel comics"
                />
                <title>Marvel Comics</title>
            </Helmet>
            <AppBanner />
            <CommicList />
        </>
    )
}

export default ComicsPage