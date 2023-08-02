import { Component } from "react";
import { Navigate } from "react-router-dom";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import authService from "../services/auth.service";
import IUser from "../types/user.type";

type Props = {};

type State = {
  users: Array<IUser>;
  redirect: string | null;
  loading: boolean;
  message: string;
};

export default class BoardUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
		users: [],
      	redirect: null,
	  	loading: false,
	  	message: "",
    };
  }

  componentDidMount() {
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {		
      	this.setState({ redirect: "/login" });
    } else {
		this.setState({ loading: true });

		UserService.getUsers().then(
			(response) => {
			if (response.status === 200) {
				// console.log(response.data.data);
				
				this.setState({
					users: response.data.data,
					loading: false
				});
			}
			},
			(error) => {
				this.setState({
					message: (error.response && error.response.data && error.response.data.message) || error.message || error.toString(),
					loading: false
				});

			// if (error.response && error.response.status === 401) {
			//   EventBus.dispatch("logout");
			// }
			}
		);
    }
  }

  render() {
	if (this.state.redirect) {			
		return <Navigate to={this.state.redirect} />;
	}

	const { loading, users } = this.state;	

    return (
      <div className="container">
		{ loading && (
			<div className="loading-overlay">
				<div className="loading-spinner"></div>
			</div>
		)}
        <header className="jumbotron">
          <h3>Usuarios</h3>
        </header>
		<div className="container mt-5">
			<div className="row">
			<div className="col">
				<table className="table table-bordered">
				<thead>
					<tr>
					<th>Nombre completo</th>
					<th>Correo</th>
					<th>Roles</th>
					</tr>
				</thead>
				<tbody>
					{ users.map((user, index) => (
						<tr key={index}>
							<td> { user.name } </td>
							<td> { user.email } </td>
							<td>
								<ul>
									{/* {
									user.roles.map((role, index) => (
										<li key={index}>{role.display_name}</li>
									))} */}									
								</ul>
							</td>
						</tr>
					))}
				</tbody>
				</table>
			</div>
			</div>
		</div>

      </div>
    );
  }
}