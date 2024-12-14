import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  info=new FormControl('')
  time=new FormControl('')
  tasks: any[]=[];
  dettime: any;
  detinform: any;
  id: any;
  ctasks:any[]=[];
  Dbid: any;
  Listid: any;
  ttasks: any[]=[];
 retime=new FormControl('')
  ttasksId: any;
  

  constructor(private service:ServiceService) { }

  ngOnInit(): void {
    this.getdata()
  }
  getdata(){
    this.service.getData().subscribe((res:any)=>{
      console.log(res.data,"data");
     res.data.forEach((result:any)=>{
        this.tasks.push({
          id:result._id,
          info:result.info,
           time:result.time,
           status:result.status
      })
      })
      
       
    })
    
  }

  idget(id:any){
    console.log(id,"id");
    this.id=id
    this.service.getid(id).subscribe((res:any)=>{
      console.log(res,"ththr");
      
      this.detinform=res.data.info
      let timeleft=res.data.time
      this.dettime=this.subtractCurrentTimeFromTarget(timeleft)
    })
    
  }
 subtractCurrentTimeFromTarget(targetTime:any) {    let now = new Date();
    let currentHours = now.getHours();
    let currentMinutes = now.getMinutes();
    let currentTimeInMinutes = (currentHours * 60) + currentMinutes;
    let [targetHours, targetMinutes] = targetTime.split(':').map(Number);
    let targetTimeInMinutes = (targetHours * 60) + targetMinutes;
    if (currentTimeInMinutes >= targetTimeInMinutes) {
      this.terminate(this.id)
        return "00:00";  
    }
    let resultMinutes = targetTimeInMinutes - currentTimeInMinutes;
    let resultHours = Math.floor(resultMinutes / 60);
    let resultRemainingMinutes = resultMinutes % 60;
    let resultTime = `${resultHours}:${String(resultRemainingMinutes).padStart(2, '0')}`;
    console.log(resultTime);
   
    return resultTime;
}
terminate(id: any) {
  this.service.updateStatus(id, "Terminated").subscribe((res: any) => {
    console.log("Task Terminated", res);
    this.tasks = this.tasks.filter(task => task.id !== id); // Remove terminated task from the list
  });
}

// This will check for terminated tasks every minute
checkForTerminatedTasks() {
  setInterval(() => {
    this.tasks.forEach(task => {
      if (task.dettime === "00:00" && task.status !== "Terminated") {
        this.terminate(task.id); // Automatically terminate the task
      }
    });
  }, 60000); // Check every 60 seconds
}

complete() {
  if (this.dettime === '00:00' || this.detinform.status === 'Terminated') {
    console.log("Task is already terminated, cannot mark as complete.");
    return;  
  }

  this.service.updatecomplete(this.Dbid).subscribe((res: any) => {
    console.log(res, "Updated task status to complete");
    this.tasks.splice(this.Listid, 1);
  });
}

precomplete(id: any, listid: any) {
  this.Dbid = id;
  this.Listid = listid;
  
  const task = this.tasks.find((t: any) => t.id === id);
  if (task) {
    this.detinform = task; // Store the task's info for checking
  }
}

postdata() {
  let taskdata = {
    "info": this.info.value,
    "time": this.time.value
  }
  this.service.postData(taskdata).subscribe((resp: any) => {
    console.log(resp, "bh");
    const dettime = this.subtractCurrentTimeFromTarget(resp.data.time); // Calculate dettime
    this.tasks.push({
      id: resp.data._id,
      info: resp.data.info,
      time: resp.data.time,
      status: resp.data.status,
      dettime: dettime // Add dettime for the new task
    });
  })
}

getcomplete(){
  this.service.getcomplete().subscribe((res:any)=>{
    console.log(res);
    res.data.forEach((result:any)=>{
      this.ctasks.push({
        id:result._id,
        info:result.info,
         time:result.time,
         status:result.status
    })
    })
  })
}
getterminate(){
  this.service.getterminate().subscribe((res:any)=>{
    console.log(res);
    res.data.forEach((result:any)=>{
      this.ttasks.push({
        id:result._id,
        info:result.info,
         time:result.time,
         status:result.status
    })
    })
  })
}
prenew(id:any){
  this.ttasksId=id
  console.log(this.ttasksId,"ghf");
  
}
renew(){
  let ret=this.retime.value

  console.log(ret,this.ttasksId,"ref");
  this.service.renewterminate(this.ttasksId,ret,"In Progress").subscribe((res:any)=>{
    console.log(res,"trh");
    this.ttasks=[]
    this.tasks=[]
    this.getterminate()
  this.getdata()

  })
}
delete(id:any,listid:any){
  this.service.delete(id).subscribe((res:any)=>{
    console.log("successfully deleted Task",res);
    this.ctasks.forEach((res)=>{
      if(res.id==id){
        this.ctasks.splice(listid,1)
      }
    })
    
    
  })
}
}
