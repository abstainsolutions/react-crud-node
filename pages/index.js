import React from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css'

export default class Home extends React.Component {
	state = {
		users: [],
		username:'',
		row_id:'',
		designation:'',
		username_error:'',
		designation_error:'',
	}
	componentDidMount() {
		this.fetchUsers();
	}
	fetchUsers() {
		axios.get('http://localhost:5000/')		// Update this endpoint accordingly
		.then(res => {
			const users = res.data;
			console.log(users)
			this.setState({ users });
		}).catch(error => {
			//alert('DB connection failed please set up db and try again.');
		});
	}
	addUser() {
		var username = this.state.username;
		var designation = this.state.designation;
		var row_id = this.state.row_id;
		var errors = 0;
		if(username=="") {
			errors = 1;
			this.setState({username_error:'Username is a required field.'});
		}
		if(designation=="") {
			errors = 1;
			this.setState({designation_error:'Designation is a required field.'});
		}
		if(errors==0){
			
			var payload = {};
			payload['username'] = username;
			payload['designation'] = designation;
			payload['row_id'] = row_id;
			axios({
			method: "post",
			url: "http://localhost:5000/addUser", // Update this endpoint accordingly
			data: payload,
			}).then((response) => {
			location.reload();
			}, (error) => {
			  alert('DB connection failed please set up db and try again.');
			});
		}
		
		return;
	}
	deleteUser(id) {
		var check = confirm('Are you sure?');
		var payload = {};
			payload['id'] = id;
		if(check==true)	{
			axios({
			method: "post",
			url: "http://localhost:5000/deleteUser",	// Update this endpoint accordingly
			data: payload,
			}).then((response) => {
			 location.reload();
			}, (error) => {
			 alert('DB connection failed please set up db and try again.');
			});
		}
	}
	editUser(id,username,designation) {
		this.setState({username:username});
		this.setState({designation:designation});
		this.setState({row_id:id});
	}
	showRows() {
		let array = [];
		const object_data = this.state.users;
		if( object_data.data !== undefined && object_data.data !== null){
			const object = object_data.data;
			const object_length = object.length;
			for (let i = 0; i < object_length; i++) {
				array.push([object[i]['id'],object[i]['username'],object[i]['designation']]);
			}
			var length = array.length;
			if(length>0){
				return array.map((obj, index) => {
				return  <tr  key={index+1}><td>{index+1}</td><td>{obj[1]}</td><td>{obj[2]}</td><td><button onClick={() => this.editUser(obj[0],obj[1],obj[2])}>Edit</button><button onClick={() => this.deleteUser(obj[0])}>Delete</button></td></tr> 
				});
			} 
		}
	}
	onChange = event => {
		var error_field_name = event.target.id+'_error';
		this.setState({ [event.target.id]: event.target.value });
		if(event.target.value!='')
		this.setState({ [error_field_name]: '' });
	};
	render() {
	return (
		 <><div style={{'padding':'20px','float':'left'}}>
			<span style={{'fontWeight':'bold','textDecoration':'underline'}}>User Listing</span>
			<table style={{'border':'1px solid','marginTop':'10px','padding':'10px'}}>
				<thead>
					<tr >
						<th>Sr No.</th>
						<th>Name</th>
						<th>Designation</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{this.showRows()}
				</tbody>
			</table>
		</div>
		<div style={{'padding':'20px','float':'left'}}>
			<span style={{'fontWeight':'bold','textDecoration':'underline'}}>Add New User</span>
			<table style={{'marginTop':'10px','padding':'10px'}}>
				<thead>
					<tr>
						<th>Name</th>
						<td>&nbsp;</td>
						<td><input type="text" value={this.state.username} id="username"  onChange={this.onChange} /></td>
						<td><span style={{'color':'red','fontSize':'12px'}}>{this.state.username_error}</span></td>
					</tr>
					
					<tr>
						<th>Designation</th>
						<td>&nbsp;</td>
						<td><input type="text" value={this.state.designation} id="designation" onBlur={this.onChange} onChange={this.onChange}  /></td>
						<td><span style={{'color':'red','fontSize':'12px'}}>{this.state.designation_error}</span></td>
					</tr>
					<tr>
						<th>&nbsp;</th>
						<td>&nbsp;</td>
						<td><button onClick={() => this.addUser()}>Add</button><button onClick={() => location.reload()}>Cancel</button></td>
					</tr>
				</thead>
				
			</table>
		</div>
		</>
		)
	}
}