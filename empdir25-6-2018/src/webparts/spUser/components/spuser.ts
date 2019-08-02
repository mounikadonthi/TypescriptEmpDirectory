export class SPUser {
    public Id: number;
    public FirstName: string;
    public LastName: string;
    public Name: string;
    public WorkEmail: string;
    public WorkPhone: string;
    public Department: string;
    public IsSiteAdmin: boolean;
    public Title: string;
    public Office: string;
    public Picture:any;
    public quaternaryText?:string;
    public quinaryText?:string;
    public secondaryTextForCard?:string;
    public teritaryTextForCard?:string;

}

export class ThemeProperties {
    public colorPickerValueForText:string;
    public NodeBackgroundColor:string;
    public AlphabetBackgroundColor:string;
    public AlphabetTextColor:string;
}