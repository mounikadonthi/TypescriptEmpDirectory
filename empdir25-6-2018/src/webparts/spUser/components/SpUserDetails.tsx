import * as React from 'react';

import { DirectoryService } from '../Services/DirectoryService';
import { SPUserService } from "../Services/SPUserService";
import { SPUser } from './spuser';
import { ISpUserProps } from './ISpUserProps';

import {EmployeeProfile} from './EmployeeProfile';
import {TileCardComponent} from './CardComponent';
import {CardComponent} from './TileCardComponent'
import {ConfigurationsComponent} from './ConfigurationsComponent';
import {LicenceAppInfoComponent} from '../components/LicenseComponents/LicenseAppInfoComponent';

import { escape } from '@microsoft/sp-lodash-subset';
import { IPersonaProps, Persona, PersonaSize, PersonaPresence } from "office-ui-fabric-react/lib/Persona";
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { PersonaModel } from '../Interfaces/SPUserPersonaModel';
import { initializeIcons } from '@uifabric/icons';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { TextField } from 'office-ui-fabric-react/lib/TextField';


import styles from './SpUser.module.scss';


export interface ISpUserState {
  Id: string;
  userName: string;
  MobileNumber: string;
}

export interface ISPUsersState {
  users: SPUser[];
  usersPersonaAttributesList: PersonaModel[];
  loggedUserPersona:PersonaModel;
  selectedRole: string;
  selectedDepartment: string;
  isSPCallOnProgress: boolean;
  selectedrolesList:string[];
  selecteddepartmentsList:string[];
  isHideDepartment:boolean;
  isHideRoles:boolean;
  isViewMoreRoles:boolean;
  isViewMoreDepartments:boolean;
  loggedUser:any;
  showPanel: boolean;
  selectedUserProperty:string;
  selectedUserProperties:string[];
  DynamicUserProperties:string[];
  UserProps:any;
  empDirUsers: SPUser[];
}

var alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export default class SpUserDetails extends React.Component<ISpUserProps, ISPUsersState> {
  public PersonaProperties;

  constructor(props?: ISpUserProps, state?: ISPUsersState) {
    
    super(props);
    initializeIcons();
    this.state = {
      users: [],
      usersPersonaAttributesList: [],
      loggedUserPersona:undefined,
      selectedRole: undefined,
      selectedDepartment: undefined,
      isSPCallOnProgress: true,
      isHideDepartment:false,
      isHideRoles:false,
      selectedrolesList:[],
      selecteddepartmentsList:[],
      isViewMoreRoles:false,
      isViewMoreDepartments:false,
      loggedUser:undefined,
      showPanel: false,
      selectedUserProperty:"",
      selectedUserProperties:[],
      DynamicUserProperties:[],
      UserProps:[],
      empDirUsers:[]
    };
    this.HideRoles = this.HideRoles.bind(this);
    this.HideDepartments =this.HideDepartments.bind(this);
    this.ViewMoreRoles = this.ViewMoreRoles.bind(this);
    this.ViewMoreDepartments =this.ViewMoreDepartments.bind(this);
    this.loadLoggedUser = this.loadLoggedUser.bind(this);
    this.addDynamicPersonaProperties = this.addDynamicPersonaProperties.bind(this);
    this.onItemsSelected = this.onItemsSelected.bind(this);
    this.getUsersByAlphabets = this.getUsersByAlphabets.bind(this);
    this.filterUsersByFirstName = this.filterUsersByFirstName.bind(this);
  }

  public componentDidMount(): void {
    debugger;
    this.getUserPropertiesData();
    this._getUsers('');
    this.loadLoggedUser();
  }
  
  private getPersonaList = (data : SPUser[]) => {
    var usersPersonaList: PersonaModel[] = [];
    if(data == [])
    data = this.state.users
    data.map((user: SPUser) => {
      var personaTemp: PersonaModel; 
      var exisitingProp;
      this.state.UserProps?  exisitingProp = this.state.UserProps:undefined;
      personaTemp= this.state.UserProps.length==0?{
        Id: user.Id,
        Name: (user.Name) ? ((user.Name || "") ) : (user.Name || ""),
        secondaryText: user.Title || "",
        tertiaryText: user.Department || "",
        optionalText: user.Name,
        imageUrl:user.Picture!=null?user.Picture.split(",")[0]:null
      }:{
        Id: user.Id,
        Name: (user.Name) ? ((user.Name || "") ) : (user.Name || ""),
        secondaryText: user[exisitingProp.secondaryText],
        tertiaryText:exisitingProp.tertiaryText != undefined?user[exisitingProp.tertiaryText]:user.Department,
        optionalText: user.Name,
        quaternaryText:exisitingProp.quaternaryText != undefined?user[exisitingProp.quaternaryText]:"",
        quinaryText:exisitingProp.quinaryText != undefined?user[exisitingProp.quinaryText]:"",
       imageUrl:user.Picture!=null?user.Picture.split(",")[0]:null,
       secondaryTextForCard:exisitingProp.secondaryTextForCard!=undefined?user[exisitingProp.secondaryTextForCard]:"",
       teritaryTextForCard:exisitingProp.teritaryTextForCard!=undefined?user[exisitingProp.teritaryTextForCard]:"",
      };
      usersPersonaList.push(personaTemp);
      user.Name = user.Name ? user.Name : user.FirstName + " " + user.LastName;
    });
    this.setState({
      usersPersonaAttributesList: usersPersonaList
    })
    return usersPersonaList;
  }
getUserPropertiesData()
{
  var spUserService = new SPUserService(this.props==undefined?this.context:this.props.context);
  this.setState({
    UserProps:this.props.UserProps[0]==undefined?this.props.UserProps:this.props.UserProps[0]
  })
  this.getPersonaList(this.state.users)
  // spUserService.getUserProperties().then(
  //   (data: any) => {
  //     this.setState({
  //       UserProps:data.value
  //   } 
  // ), this.getPersonaList(this.state.users)});
}
  private onSelectedRoleOrDepartment = () => {
    var role = this.state.selectedRole ? this.state.selectedRole : "";
    var department = this.state.selectedDepartment ? this.state.selectedDepartment : "";
    var users = this.props.directoryService.filterDirectory(role,department);
    
    if(users && users.length != 0) {
      var usersPersonaList = this.getPersonaList(users);
      this.setState({
        users: users,
        usersPersonaAttributesList: usersPersonaList
      });
    }
    else {
      this.setState({
        users: [],
        usersPersonaAttributesList: [],
        selectedRole:undefined,
        selectedDepartment:undefined
      });
    } 
  }
 public loadLoggedUser()
  {
    var spUserService = new SPUserService(this.props.context);
      spUserService.loggedUser().then(
      (data: any) => {
        this.setState({
        loggedUser:data
      })});
  }

  private onSelecedRole = (role : string) => {
   var count=0;
    if(this.state.selectedrolesList.length==0)
    {
      this.state.selectedrolesList.push(role)
    }
    else{
    this.state.selectedrolesList.map((dep)=>{if(dep==role){
      count = count+1

    }
 })
  if(count>0)
  {
    var UpdatedSelectedRoles=this.state.selectedrolesList.filter((prop)=>prop!=role);
    this.setState(
      {
        selectedrolesList:UpdatedSelectedRoles
      }
    )
    DirectoryService.rolelist=UpdatedSelectedRoles
  }
  else{
    this.state.selectedrolesList.push(role)

  }
}
    this.setState({
      selectedRole: role
    },() => {
      this.onSelectedRoleOrDepartment();
    });
  }

  private onSelectedDepartment = (department : string) => {
    var count=0;
    if(this.state.selecteddepartmentsList.length==0)
    {
      this.state.selecteddepartmentsList.push(department)
    }
    else{
    this.state.selecteddepartmentsList.map((dep)=>{if(dep==department){
      count = count+1

    }
 })
  if(count>0)
  {
     var UpdatedSelectedDepartments=this.state.selecteddepartmentsList.filter((prop)=>prop!=department);
    this.setState(
      {
        selecteddepartmentsList:UpdatedSelectedDepartments
      }
    )
    DirectoryService.departmentList=UpdatedSelectedDepartments
  }
  else{
    this.state.selecteddepartmentsList.push(department)
    DirectoryService.departmentList=this.state.selecteddepartmentsList
  }
}
    this.setState({
      selectedDepartment: department
    }, () => {
      this.onSelectedRoleOrDepartment();
    }
  );
  }

  getUsersByAlphabets(startsWith: string )
  {
    var spUserService = new SPUserService(this.props.context);
    var directoryService = new DirectoryService();
    if(startsWith=="")
    {
      DirectoryService.SPUsers = this.state.empDirUsers;
      directoryService.setRolesAndDepartments();
      var usersPersonaList = this.getPersonaList(this.state.empDirUsers);
        this.setState({
          users:[...this.state.empDirUsers],
          selectedrolesList:[],
          selecteddepartmentsList:[]
        })
    }
    else{
      var filteredUsers = this.state.empDirUsers.filter((user)=>
          user.Name.toString().charAt(0).toUpperCase()==startsWith
      )
    DirectoryService.SPUsers = filteredUsers;
    directoryService.setRolesAndDepartments();
    var usersPersonaList = this.getPersonaList(filteredUsers);
    this.setState({
      users:[...filteredUsers],
      selectedrolesList:[],
      selecteddepartmentsList:[]
    })
  }
  }
  private _getUsers(startsWith: string = '') {
    var spUserService = new SPUserService(this.props.context);
    var directoryService = new DirectoryService();
    
    this.setState({
      isSPCallOnProgress: true,
      selecteddepartmentsList:[],
      selectedrolesList:[]

    });

    spUserService.getAllUsers().then(
      (data: any) => {
        this.getUserPropertiesData();
        var keyNames = Object.keys(data.d.results[0]);
        DirectoryService.userProperties = keyNames;
        directoryService.setUserProperties();
        if (data.d.results && data.d.results.length != 0) {
         DirectoryService.SPUsers = data.d.results;
         DirectoryService.rolelist= this.state.selectedrolesList;
         DirectoryService.departmentList = this.state.selecteddepartmentsList;
         directoryService.setRolesAndDepartments();
          var usersPersonaList = this.getPersonaList(data.d.results);
          this.setState({
            users: data.d.results,
            usersPersonaAttributesList: usersPersonaList,
            selectedDepartment: undefined,
            selectedRole: undefined,
            isSPCallOnProgress: false,
            empDirUsers:data.d.results
          });
        }
        else {
          this.setState({
            users: [],
            empDirUsers:[],
            usersPersonaAttributesList: [],
            selectedDepartment: undefined,
            selectedRole: undefined,
            isSPCallOnProgress: false,
            selectedrolesList:[],
            selecteddepartmentsList:[]
          });
        }
      },
      (error: any) => {
        alert("Requested Resource cannot be fetched...");
      }
    );

  }

  
  private onItemsSelected = (userProperty : IDropdownOption) => {
    if(this.state.selectedUserProperty!=userProperty.text){
    this.setState({
      selectedUserProperty: userProperty.text
    });
  }
  else{
    this.setState({
      selectedUserProperty: ""
    });
  }
  }
  
  addDynamicPersonaProperties=()=>{
    
    this.state.selectedUserProperty!=""&& this.state.DynamicUserProperties.push(this.state.selectedUserProperty)
    var exisitingProp;
    this.state.UserProps ?  exisitingProp = this.state.UserProps:undefined;
   if(this.state.UserProps&& this.state.DynamicUserProperties.length==0 && exisitingProp.ViewType=="Card")
   {
    exisitingProp.secondaryText!="undefined"?this.state.DynamicUserProperties.push(exisitingProp.secondaryText):"";
    exisitingProp.tertiaryText!="undefined"?this.state.DynamicUserProperties.push(exisitingProp.tertiaryText):"";
    exisitingProp.quaternaryText!="undefined"?this.state.DynamicUserProperties.push(exisitingProp.quaternaryText):"";
    exisitingProp.quinaryText!="undefined"?this.state.DynamicUserProperties.push(exisitingProp.quinaryText):"";
   }
   else{
    exisitingProp.secondaryTextForCard!="undefined"?this.state.DynamicUserProperties.push(exisitingProp.secondaryTextForCard):"";
    exisitingProp.teritaryTextForCard!="undefined"?this.state.DynamicUserProperties.push(exisitingProp.teritaryTextForCard):""
   }

    var usersPerson: PersonaModel ;
      var personaTemp: PersonaModel =  {
        Id: Math.floor(Math.random() * 100) + 1  ,
        Name: this.state.loggedUser.DisplayName,
         secondaryText: ((this.state.loggedUser[ this.state.DynamicUserProperties[0]]?this.state.loggedUser[ this.state.DynamicUserProperties[0]]:
                        (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                          prop.Key ==  this.state.DynamicUserProperties[0] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[0]
                          )
                        ).length!=0? (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                          prop.Key ==  this.state.DynamicUserProperties[0] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[0]
                          )[0].Value):"")),
         tertiaryText:((this.state.loggedUser[ this.state.DynamicUserProperties[1]]?this.state.loggedUser[ this.state.DynamicUserProperties[1]]:
                          (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                            prop.Key ==  this.state.DynamicUserProperties[1] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[1]
                          )).length!=0? (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                             prop.Key ==  this.state.DynamicUserProperties[1] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[1]
                             )[0].Value):"")),
        quaternaryText:((this.state.loggedUser[ this.state.DynamicUserProperties[2]]?this.state.loggedUser[ this.state.DynamicUserProperties[2]]:
                              (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                                prop.Key ==  this.state.DynamicUserProperties[2] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[2]
                              )).length!=0? (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                                 prop.Key ==  this.state.DynamicUserProperties[2] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[2]
                                 )[0].Value):"")),    
        quinaryText:((this.state.loggedUser[ this.state.DynamicUserProperties[3]]?this.state.loggedUser[ this.state.DynamicUserProperties[3]]:
                            (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                                    prop.Key ==  this.state.DynamicUserProperties[3] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[3]
                                  )).length!=0? (this.state.loggedUser.UserProfileProperties.filter((prop)=>
                                     prop.Key ==  this.state.DynamicUserProperties[3] || prop.Key == "SPS-"+ this.state.DynamicUserProperties[3]
                                     )[0].Value):"")),  
      };
      this.setState({
        loggedUserPersona:personaTemp
      })
  }

  HideDepartments()
  {
    this.setState({
      isHideDepartment:!this.state.isHideDepartment
    })
  }
  HideRoles()
  {
    this.setState({
      isHideRoles:!this.state.isHideRoles
    })
  }
  ViewMoreRoles()
  {
    this.setState({
      isViewMoreRoles:!this.state.isViewMoreRoles
    })
  }
  ViewMoreDepartments()
  {
    this.setState({
      isViewMoreDepartments:!this.state.isViewMoreDepartments
    })
  }
  
  private onShowPanel = (): void => {
    this.addDynamicPersonaProperties();
    this.setState({ showPanel: true });
  };
  
  private onClosePanel = (): void => {
    this.getUserPropertiesData();
    this.props.onConfigurationsUpdate("onConfigureButtonClicked",false)
    this.setState({ showPanel: false,
      DynamicUserProperties:[],
      selectedUserProperty:"",
      selectedUserProperties:[]
     });
  };

  filterUsersByFirstName(searchedValue: string)
  {
   var  filteredusers= this.state.empDirUsers.filter(user =>{
      if((user.Name.toUpperCase()).substring(0, searchedValue.length) === searchedValue.toUpperCase())
      return user
    })
      var spUserService = new SPUserService(this.props.context);
      var directoryService = new DirectoryService();
      DirectoryService.SPUsers = filteredusers;
      directoryService.setRolesAndDepartments();
      var usersPersonaList = this.getPersonaList(filteredusers);
      this.setState({
        users:[...filteredusers],
        selectedrolesList:[],
        selecteddepartmentsList:[]
      })
    }
  

  private onRenderFooterContent = (): JSX.Element => {
    return (
      <div>
         <DefaultButton 
          className={styles.saveButton} > 
          Save
        </DefaultButton>
        <DefaultButton onClick={this.onClosePanel}>Cancel</DefaultButton>
      </div>
    );
  };
  

  public render(): React.ReactElement<ISpUserProps> {
    console.log("listprops",this.state.UserProps);
    console.log("webpartprops",this.props.UserProps)
    var directoryService = new DirectoryService();
    const { selectedDepartment, selectedRole } = this.state;
    const personaUsers = this.state.usersPersonaAttributesList.map((userPersona) => {
      if(this.state.UserProps&& this.state.UserProps.ViewType=="Tile")
      return  <CardComponent  userPersona ={userPersona} UserProps={this.state.UserProps} IsRoundedCornersEnabled={JSON.parse(this.state.UserProps.ShowRoundedCorners)} DefaultTheme={this.state.UserProps.ThemeType} NodeBackgroundColor={this.state.UserProps.NodeBackgroundColor} colorPickerValueForText={this.state.UserProps.NodeTextColor} IsRoundedImage={JSON.parse(this.state.UserProps.ShowRoundedImage)}/>
      else if(this.state.UserProps && this.state.UserProps.ViewType=="Card")
      return  <TileCardComponent  userPersona ={userPersona}  UserProps={this.state.UserProps} IsRoundedCornersEnabled={JSON.parse(this.state.UserProps.ShowRoundedCorners)} DefaultTheme={this.state.UserProps.ThemeType} NodeBackgroundColor={this.state.UserProps.NodeBackgroundColor} colorPickerValueForText={this.state.UserProps.NodeTextColor} IsRoundedImage={JSON.parse(this.state.UserProps.ShowRoundedImage)}/>
      else return <CardComponent  userPersona ={userPersona} UserProps={this.state.UserProps} />
    });
   


    return (
        <div className={styles.spUser+" "+"ms-Grid"}>
        {
        <div className={"ms-Grid-row"}>
        <div className={"ms-Grid-col ms-sm12 ms-md3 ms-lg2"}  > 
        <div className={styles.row}>
        <div className={styles.rolesandDepartmentsDiv}>
          <h2 onClick={this.HideDepartments} className={this.state.isHideDepartment==false?"ms-Icon ms-Icon--Blocked2"+" "+styles.BoldFont+" "+styles.pointerCursor+" "+styles.rolesandDepartments:"ms-Icon ms-Icon--CirclePlus"+" "+styles.BoldFont+" "+styles.pointerCursor+" "+styles.rolesandDepartments}>Departments</h2>
          {
            this.state.isHideDepartment == false &&
              DirectoryService.Departments.slice(0, 3).map((dep) => {
                return (<div className={styles.empDepartments} style={this.state.UserProps?{color:this.state.UserProps.AlphabetTextColor}:{color:"black"}} ><Checkbox checked={this.state.selecteddepartmentsList.length>0 && (this.state.selecteddepartmentsList.some((dept)=> dept== dep.text))} onChange={()=>this.onSelectedDepartment(dep.text)}  /><span className={styles.departmentandRoleNames}>{dep.text}</span><span>({dep.count})</span></div>)
              })
          }
          {
             DirectoryService.Departments.length>3 && this.state.isHideDepartment == false && this.state.isViewMoreDepartments== false && <div onClick={this.ViewMoreDepartments}><a className={styles.viewmore +" "+styles.BoldFont+" "+styles.pointerCursor}>View More</a></div>
          }
          {
             this.state.isHideDepartment == false && this.state.isViewMoreDepartments==true &&
              DirectoryService.Departments.slice(3, DirectoryService.Roles.length).map((dep) => {
                return (<div className={styles.empDepartments} style={this.state.UserProps?{color:this.state.UserProps.AlphabetTextColor}:{color:"black"}}><Checkbox checked={this.state.selecteddepartmentsList.length>0 && (this.state.selecteddepartmentsList.some((dept)=> dept== dep.text))} onChange={()=>this.onSelectedDepartment(dep.text)}  /><span className={styles.departmentandRoleNames}>{dep.text}</span><span>({dep.count})</span></div>)
              })
          }
        </div>
        <div className={styles.rolesandDepartmentsDiv}>
           <h2 onClick={this.HideRoles} className={this.state.isHideRoles==false?"ms-Icon ms-Icon--Blocked2"+" "+styles.BoldFont+" "+styles.pointerCursor+" "+styles.rolesandDepartments:"ms-Icon ms-Icon--CirclePlus"+" "+styles.BoldFont+" "+styles.pointerCursor+" "+styles.rolesandDepartments}>Roles</h2>
          {
             this.state.isHideRoles == false &&
              DirectoryService.Roles.slice(0, 3).map((role) => {
                  return (
                    <div className={styles.empRoles} style={this.state.UserProps ?{color:this.state.UserProps.AlphabetTextColor}:{color:"black"}}><Checkbox checked={this.state.selectedrolesList.length>0 && (this.state.selectedrolesList.some((emprole)=> emprole== role.text))}  onChange={()=>this.onSelecedRole(role.text)}  /><span className={styles.departmentandRoleNames}>{role.text}</span><span>({role.count})</span></div>
                  )
              })
          }
          {
           DirectoryService.Roles.length>3 && this.state.isHideRoles == false && this.state.isViewMoreRoles== false && <div onClick={this.ViewMoreRoles}><a className={styles.viewmore+" "+styles.BoldFont+" "+styles.pointerCursor}>View More</a></div>
          }
          {
             this.state.isHideRoles == false && this.state.isViewMoreRoles==true &&
              DirectoryService.Roles.slice(3, DirectoryService.Roles.length).map((role) => {
                  return (
                    <div className={styles.empRoles} style={this.state.UserProps?{color:this.state.UserProps.AlphabetTextColor}:{color:"black"}}><Checkbox checked={this.state.selectedrolesList.length>0 && (this.state.selectedrolesList.some((emprole)=> emprole== role.text))} onChange={()=>this.onSelecedRole(role.text)}  /><span className={styles.departmentandRoleNames}>{role.text}</span><span>({role.count})</span></div>
                  )
              })
          }
        </div>
          </div>
        </div>
        <div className={"ms-Grid-col ms-sm12 ms-md9 ms-lg10" }  > 
        <div className={styles.iconsDiv}>
        <div className={styles.iconsButtonsDiv}> <Icon iconName="Contact" /><span>Profile</span></div>
        <div className={styles.iconsButtonsDiv} onClick={this.onShowPanel}><Icon iconName="Settings" /><span>Settings</span></div>
        </div>
        { 
         ((this.state.UserProps&& this.state.UserProps.ShowAlphabets==true))&&
          <div className={styles.row}>
            <div  style={this.state.UserProps?{color:this.state.UserProps.AlphabetTextColor}:{color:"black"}}>
              <span onClick={this.getUsersByAlphabets.bind(this, "")} key="0" className={styles.alphabets+" "+styles.BoldFont+" "+styles.pointerCursor} style={this.state.UserProps ?{backgroundColor: this.state.UserProps.AlphabetBackgroundColor,color:this.state.UserProps.AlphabetTextColor}:{backgroundColor:"rgb(237, 236, 236)",color:"black"}}>
                  All
              </span>
              {[...alphabets.map((x, i) => {
                return   <span key={i} className={styles.BoldFont+" "+styles.alphabets+" "+styles.pointerCursor} style={this.state.UserProps ?{backgroundColor: this.state.UserProps.AlphabetBackgroundColor,color:this.state.UserProps.AlphabetTextColor}:{backgroundColor:"rgb(237, 236, 236)",color:"black"}} onClick={this.getUsersByAlphabets.bind(this, String.fromCharCode(65 + i))}>{String.fromCharCode(65 + i).toString()}</span>;
              })]}
            </div>
          </div>
        }
        {<div>
             <SearchBox
             className={"ms-sm3" +" "+styles.searchBar}
             placeholder="Search Users"
             onChanged={this.filterUsersByFirstName}
           />
        </div>
        }
         

          <div className={styles.userDirectory } >
            {this.state.users && this.state.users.length != 0 && !this.state.isSPCallOnProgress &&
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 block ">
                { personaUsers }
              </div>
              </div>
            }
            { this.state.isSPCallOnProgress && <Spinner size={ SpinnerSize.large } label='Fetching Results...' /> }
            {(!this.state.users || this.state.users.length == 0) && !this.state.isSPCallOnProgress && 
              <div className=" ms-sm12 block">
                No User Profiles are found.
              </div>
            }
          </div>
        </div>
        {
          (this.state.showPanel == true || this.props.onConfigureButtonClicked==true ) &&
          <ConfigurationsComponent context={this.props.context} onConfigurationsUpdate={this.props.onConfigurationsUpdate} getPersonaList={this.getPersonaList} onClosePanel={this.onClosePanel} loggedUser ={this.state.loggedUser} getUserPropertiesData={this.getUserPropertiesData} UserProps={this.state.UserProps} DynamicUserProperties={this.state.DynamicUserProperties}/>
        }
        </div>
        }
        </div>
       
    );
  }


}
