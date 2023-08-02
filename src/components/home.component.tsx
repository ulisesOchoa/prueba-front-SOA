import { Component } from "react";

import UserService from "../services/user.service";

type Props = {};

type State = {
	content: string;
};

export default class Home extends Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			content: "",
		};
	}

	render() {
		return (
			<div className="container">
				<header className="jumbotron">
					<h3>Bienvenid@ al sitio web SOA</h3>
				</header>
			</div>
		);
	}
}
