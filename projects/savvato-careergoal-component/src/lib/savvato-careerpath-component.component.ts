import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FunctionPromiseService } from '@savvato-software/savvato-javascript-services'
import { ModelService } from './_services/model.service'

@Component({
  selector: 'lib-savvato-careerpath-component',
  templateUrl: './savvato-careerpath-component.html',
  styleUrls: ['./savvato-careerpath-component.component.scss']
})
export class SavvatoCareerpathComponentComponent implements OnInit {

  @Input() ctrl: any;

  answerQualityFilter = undefined;
  hideAnswerQualityFilters = false;
  getCareerGoalProviderFunction = () => { return undefined };
  careerGoal = undefined;
  careerGoalId = undefined;
  user = undefined;
  userId: number = -1;

  onPathNameClickFunc = (p: any) => { }
  onMilestoneNameClickFunc = (m: any) => { }
  onLabourNameClickFunc = (l: any) => { }
  onQuestionClickFunc = (q: any) => { }

  funcKey = "careerpath-controller1Xr7";

  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _modelService: ModelService,
    private _functionPromiseService: FunctionPromiseService) {

  }

  environment = undefined;
  getEnvironment() {
    return this.environment;
  }

  ngOnInit() {
    let self = this;

    self.ctrl.then((ctrl: any) => {
      self.environment = ctrl.getEnv();
      self._modelService._init(ctrl.getEnv());

      self.getCareerGoalProviderFunction = ctrl.getCareerGoalProviderFunction;
      self.onPathNameClickFunc = ctrl.onPathNameClick;
      self.onMilestoneNameClickFunc = ctrl.onMilestoneNameClick;
      self.onLabourNameClickFunc = ctrl.onLabourNameClick;
      self.onQuestionClickFunc = ctrl.onQuestionClick;

      if (!ctrl.getUser) {
        self._modelService.setAnswerQualityFilter(self._modelService.NO_FILTER);
        self.hideAnswerQualityFilters = true;
      } else {
        self.user = ctrl.getUser();

        if (self.user) {
          self.userId = self.user['id'];

          self._modelService.getAskedQuestions(self.userId).then((askedQuestions: [{}]) => {
            if (!askedQuestions.length) {
              self._modelService.setAnswerQualityFilter(self._modelService.NO_FILTER);
              self.hideAnswerQualityFilters = true;
            }
          })
        }

        self._functionPromiseService.initFunc("getQuestionsFromLabourFunc", (data: any) => {
          return new Promise((resolve, reject) => {
            if (self._modelService.getAnswerQualityFilter() === self._modelService.NO_FILTER) {
              resolve(data['labour']['questions']);
            }

            self._modelService.getFilteredListOfQuestions(self.userId).then((flq: [{}]) => {
              if (data['labour']) {

                // TODO: This same code appears in model.service. Find a common place for it
                let res = data['labour']['questions'].filter(
                  (q: any) => {
                    return flq.map((q1: any) => q1['id']).includes(q['id']);
                  })

                resolve(res)
              } else {
                reject();
              }
            })
          })
        })
      }
    })
  }

  getCareerGoalName() {
    if (this.getCareerGoalProviderFunction) {
      let cg = this.getCareerGoalProviderFunction();

      if (cg) {
        return cg['name'];
      }
    }

    return undefined;
  }

  LEVEL_QUESTION = 5
  getQuestionsFromLabour(labour: any){
    if (labour && this.myLevelIsShowing(this.LEVEL_QUESTION)) {
      let rtn = undefined;

      if (this.user) {
        rtn = this._functionPromiseService.get("getQuestionsFromLabourFunc"+labour['id'], "getQuestionsFromLabourFunc", {labour: labour});
      } else {
        rtn = labour['questions'] || [ ];
      }

      return rtn;
    } else {
      return [ ];
    }
  }

  LEVEL_LABOURS: number = 4
  getLaboursFromMilestone(milestone: any) {
    let self = this;
    if (milestone && this.myLevelIsShowing(this.LEVEL_LABOURS)) {
      let rtn = undefined;

      if (this.user) {
        rtn = milestone['labours'].filter((l: any) => self._modelService.labourContainsFilteredQuestion(self.userId, l));
      } else {
        rtn = milestone['labours'] || [ ];
      }

      return rtn;
    } else {
      return [ ];
    }
  }

  LEVEL_MILESTONE = 3
  getMilestonesFromPath(path: any) {
    let self = this;
    if (path && this.myLevelIsShowing(this.LEVEL_MILESTONE)) {
      let rtn = undefined;

      if (this.user) {
        rtn = path['milestones'].filter((m: any) => self._modelService.milestoneContainsFilteredQuestion(self.userId, m));
      } else {
        rtn = path['milestones'] || [ ];
      }

      return rtn;
    } else {
      return [ ];
    }
  }

  LEVEL_PATHS = 2
  getCareerGoalPaths(cg: any) {
    let self = this;
    if (cg && this.myLevelIsShowing(this.LEVEL_PATHS)) {
      let rtn = undefined;

      if (this.user) {
        rtn = cg['paths'].filter((p: any) => self._modelService.pathContainsFilteredQuestion(self.userId, p));
      } else {
        rtn = cg['paths'] || [ ];
        console.log("## cg == ", cg, rtn);
      }

      return rtn;
    } else {
      return [ ];
    }
  }

  LEVEL_CAREER_GOAL = 1
  getCareerGoal() {
    if (this.getCareerGoalProviderFunction && this.myLevelIsShowing(this.LEVEL_CAREER_GOAL)) {
      let cg = this.getCareerGoalProviderFunction();
      return [cg];
    } else {
      return [ ];
    }
  }

  selectedCollapseToLevel: number = this.LEVEL_LABOURS;
  myLevelIsShowing(myLevel: any) {
    return this.selectedCollapseToLevel >= myLevel;
  }

  getSelectedCollapseToLevel() {
    return this.selectedCollapseToLevel; // returns the value attribute of the selected choice
  }

  getSelectedAnswerQualityFilter() {
    let rtn = this._modelService.getAnswerQualityFilter();
    return rtn;
  }

  getSelectedCollapseToLevelText() {
    if (this.selectedCollapseToLevel === 1)
      return 'Career Goal';
    else if (this.selectedCollapseToLevel === 2)
      return 'Path';
    else if (this.selectedCollapseToLevel === 3)
      return 'Milestone';
    else if (this.selectedCollapseToLevel === 4)
      return 'Labour';
    else if (this.selectedCollapseToLevel === 5)
      return 'Full Detail';
    else
      return 'Unknown';
  }

  onAnswerQualityFilterChange(evt: any) {
    this._modelService.setAnswerQualityFilter(evt.target.value);
  }


  //  Provide user-defined handlers for these

  onPathNameClick(path: any) {
    this.onPathNameClickFunc && this.onPathNameClickFunc(path);
  }

  onMilestoneNameClick(milestone: any) {
    this.onMilestoneNameClickFunc && this.onMilestoneNameClickFunc(milestone);
  }

  onLabourNameClick(labour: any) {
    this.onLabourNameClickFunc && this.onLabourNameClickFunc(labour);
  }

  onQuestionClicked(q: any) {
    this.onQuestionClickFunc && this.onQuestionClickFunc(q);
  }

/*  onEditCareerGoalBtnClick() {
    this._router.navigate(['/career-goals/edit/' + this.careerGoalId]);
  }
  */
}
