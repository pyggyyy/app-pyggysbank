export interface Play{
    id: string,
    title: string;
    content:string;
    imagePath: string;
    creator:string;
    stake: number;
    payout: number;
    graded: boolean;
    ifWin: boolean;
}