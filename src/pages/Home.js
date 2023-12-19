import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';

export default function Home(params) {
    return (
        <div className="home">
            <div className="container">
                <Sidebar />
                <Chat />
            </div>
        </div>
    )
};
