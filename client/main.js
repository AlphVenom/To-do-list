import { ReactiveVar} from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Accounts } from 'meteor/accounts-base';

import './main.html';
import '../library/collection.js';



Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

Template.task.helpers({
	MainAll() {
		return tasksDB.find({});
	},
	isPrivate(){
		if(tasksDB.findOne({'_id':this._id}).Status=="private"){
			if(Meteor.user()){
				if(Meteor.user()._id==tasksDB.findOne({'_id':this._id}).postedBy){
					return true;
				}
			}
		}
		return false;
	},
	isPublic(){
		if(tasksDB.findOne({'_id':this._id}).Status=="public"){
			return true;
		}
		return false;
	}
});

Template.addTask.events({
	'change .js-addTask'(event)	{
		var task = $("#taskpath").val();
		if(task == ""){
			alert("You must enter a name for the path");
		}
		else{
			var status = $("#TaskStatus").val();
			tasksDB.insert({"Task":task, "createdOn":new Date().getTime(), "postedBy":Meteor.user()._id, 'Status':status, "checked":false});
		}
	},
});

Template.task.events({
	'click .js-remove'(event, instance) {
	  var taskID = this._id;
	  $("#" + taskID).fadeOut("slow","swing", function(){
	  	tasksDB.remove({_id:taskID});
	  });
  	},
  	'click .js-checked'(event){
  		console.log("check ");
  		var elementname="Checked" + this._id;
  		var val = document.getElementById(elementname);
  		console.log(event.currentTarget.checked);
  		taskDB.update({'_id':this._id},{$set:{'checked': val.checked}});
  	}
});


Template.mainBody.helpers({
	userName(){
		var uId = tasksDB.findOne({_id:this._id}).postedBy;
		return Meteor.users.findOne({_id:uId}).username;
	},
	userId(){
		return tasksDB.findOne({_id:this._id}).postedBy;
	},

	'click .js-showUser'(event){
		event.preventDefault();
		Session.set("userFilter", event.currentTarget.id);
	},		
});




 	



 





