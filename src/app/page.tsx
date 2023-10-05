import "./styles/app.scss";
import UserInfo from "./components/UserInfo";
import ToDoLists from "./components/ToDoLists";

export default async function Home() {

  return (
    <div className="container">
      <div className="app_container">
        <UserInfo />
        <ToDoLists />
      </div>
    </div>
  )
}
