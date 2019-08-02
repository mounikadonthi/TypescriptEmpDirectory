import { SPUser } from "../components/spuser";
import { Role, Department,userProperties } from "../Interfaces/UserProfileDepartment";


export class DirectoryService {

    static SPUsers : SPUser[] = [];
    static Roles: Role[] = [];
    static Departments: Department[] = [];
    static rolelist:string[]=[];
    static departmentList : string[]=[];
    static userProperties : any[]=[];
    static Properties :userProperties[]=[];

    public filterDirectory = (byRole: string | number = "", byDepartment: string | number = "") : SPUser[] =>  {
        debugger;
        var emplist:SPUser[] = [];

        var role :boolean;
        var dept:boolean;
        if(DirectoryService.departmentList.length==0 && DirectoryService.rolelist.length==0)
        {
            return DirectoryService.SPUsers
        }
        else if(DirectoryService.rolelist.length==0)
        {
            emplist = DirectoryService.SPUsers.filter(user => {
                dept =   DirectoryService.departmentList.some((dept)=>{ return dept == user.Department});
                if( dept )
                return user;
             })
             return emplist;
        }
        else if(DirectoryService.departmentList.length==0)
        {
            emplist = DirectoryService.SPUsers.filter(user => {
                role =   DirectoryService.rolelist.some((role)=>{ return role == user.Title});
                if( role)
                return user;
             })
             return emplist;
        }
         
        else
        {
            emplist = DirectoryService.SPUsers.filter(user => {
            role =   DirectoryService.rolelist.some((role)=>{ return role == user.Title});
            dept =   DirectoryService.departmentList.some((dept)=>{ return dept == user.Department});
            if( dept && role)
            return user;
            })
            return emplist;
        }
    }

    public setUserProperties=()=>{
       var properties= DirectoryService.userProperties;
       DirectoryService.userProperties.map((properties:any,index:number) => {
           if(properties!="__metadata"){
        DirectoryService.Properties.push({
            key: (index).toString(),
            text: properties,
            
        });}})
    
    }

    public setRolesAndDepartments = () => {
        DirectoryService.Roles = [];
        DirectoryService.Departments = [];
        if(DirectoryService.SPUsers && DirectoryService.SPUsers.length > 0) {
            DirectoryService.SPUsers.map((spUser: SPUser) => {
                var depcount = 1;
                var roleCount=1;
                if(spUser.Department == null || spUser.Department == "" || spUser.Title == "" || spUser.Title == "" )
                    return;
                    if(DirectoryService.Roles.filter(role => role.text == spUser.Title).length != 0)
                    {
                     depcount=depcount+1; 
                     DirectoryService.Roles.map(role=>{
                        if(role.text==spUser.Title)
                        {
                            role.count=depcount;
                            return {role}
                        }
                    })
                    }
                else {
                    DirectoryService.Roles.push({
                        key: (DirectoryService.Roles.length + 1).toString() ,
                        text: spUser.Title,
                        count:depcount
                    });
                }
              
                if(DirectoryService.Departments.filter(department => department.text == spUser.Department).length != 0) {
                    roleCount=roleCount+1;
                   DirectoryService.Departments.map(dept=>{
                    if(dept.text==spUser.Department)
                    {
                        dept.count=roleCount;
                        return {dept}
                    }
                })
                }
                else{
                    DirectoryService.Departments.push({
                        key: (DirectoryService.Roles.length + 1).toString(),
                        text: spUser.Department,
                        count:roleCount
                    });
                }
                return;
            });
        }
    }

 

}
