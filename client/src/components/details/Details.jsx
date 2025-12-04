import { Link, useNavigate, useParams } from "react-router";
import CreateComment from "./create-comment/CreateComment";
import DetailsComments from "./details-comments/DetailsComments";
import useRequest from "../../hooks/useRequest";
import { useUserContext } from "../../contexts/UserContext";
import { useOptimistic } from "react";

export default function Details() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUserContext();
    const { data: game, request } = useRequest(`/data/games/${gameId}`, {})

    const urlParams = new URLSearchParams({
        where: `gameId="${gameId}"`,
        load: 'author=_ownerId:users'
    });

    const { data: comments, setData: setComments } = useRequest(`/data/comments?${urlParams.toString()}`, []);
    // TODO Fix bug with additional re-renders
    const [optimisticComments, dispatchOptimisticComments] = useOptimistic(comments, (state, action) => {
        switch (action.type) {
            case 'ADD_COMMENT':
                return [...state, action.payload];
            default:
                return state;
        }
    });

    const deleteGameHandler = async () => {
        const isConfirmed = confirm(`Are you sure you want to delete game: ${game.title}`);

        if (!isConfirmed) {
            return;
        }

        try {
            await request(`/data/games/${gameId}`, 'DELETE');

            navigate('/games');
        } catch (err) {
            alert('Unable to delete game: ', err.message);
        }
    };

    const createEndCommentHandler = (createdComment) => {
        setComments(prevComments => [...prevComments, { ...createdComment, author: user }]);
    };

    const createStartCommentHandler = (newComment) => {
        dispatchOptimisticComments({ type: 'ADD_COMMENT', payload: { ...newComment, author: user, pending: true } });
    };

    return (
        <section id="game-details">
            <h1>Game Details</h1>
            <div className="info-section">

                <div className="header-and-image">
                    <img className="game-img" src={game.imageUrl} alt={game.title} />

                    <div className="meta-info">
                        <h1 className="game-name">{game.title}</h1>

                        <p className="data-row">
                            <span className="label">Genre:</span>
                            <span className="value">{game.genre}</span>
                        </p>

                        <p className="data-row">
                            <span className="label">Active Players:</span>
                            <span className="value">{game.players}</span>
                        </p>

                        <p className="data-row">
                            <span className="label">Release Date:</span>
                            <span className="value">{game.date}</span>
                        </p>
                    </div>
                    <div className="summary-section">
                        <h2>Summary:</h2>
                        <p className="text-summary">{game.summary}</p>
                    </div>
                </div>


                {/* <!-- Edit/Delete buttons ( Only for creator of this game )  --> */}
                <div className="buttons">
                    <Link to={`/games/${gameId}/edit`} className="button">Edit</Link>
                    <button className="button" onClick={deleteGameHandler}>Delete</button>
                </div>

                <DetailsComments comments={optimisticComments} />
            </div>

            {isAuthenticated && <CreateComment user={user} onCreateStart={createStartCommentHandler} onCreateEnd={createEndCommentHandler} />}
        </section>
    );
}
