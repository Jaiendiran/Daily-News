import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPostsByID } from "../store/utils/thunks";
import moment from "moment";
import { clearPostByID } from "../store/reducers/posts";



const PostComponent = () => {
    const posts = useSelector(state => state.posts);
    const dispatch = useDispatch();
    let params = useParams();

    useEffect(() => {
        dispatch(fetchPostsByID(params.id))
    }, []);

    useEffect(() => {
        return () => {
            dispatch( clearPostByID() )
        }
    }, []);

    return (
        <>
            { posts.postByID? 
                <div className="article_container">
                    <h1>{ posts.postByID.title }</h1>
                    <div className="image" style={{background:`url(${posts.postByID.imagexl})`}} ></div>
                    <div className="author">
                        Created by: <span>{posts.postByID.author}</span> - { moment(posts.postByID.createdAt).format('DD MMMM') }
                    </div>
                    <div className="content mt-3">
                        <div dangerouslySetInnerHTML={{__html:posts.postByID.content}}></div>
                    </div>
                </div>
            : null }
        </>
    )
}

export default PostComponent;