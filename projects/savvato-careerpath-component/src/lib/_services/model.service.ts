import { Injectable } from '@angular/core';

// import { JWTApiService } from '@savvato-software/savvato-javascript-services'
import { FunctionPromiseService } from '@savvato-software/savvato-javascript-services'

@Injectable({
	providedIn: 'root'
})
export class ModelService {

	LABOUR_CONTAINS_FILTERED_QUESTIONS = "lcfq";
	NO_FILTER = "noFilter"
	GET_ASKED_QUESTIONS = "getAskedQuestions";
	GET_CORRECTLY_ANSWERED_QUESTIONS = "getAllCorrectlyAnsweredQuestions";
	GET_INCORRECTLY_ANSWERED_QUESTIONS = "getAllIncorrectlyAnsweredQuestions";

	constructor( // private _apiService: JWTApiService,
				private _functionPromiseService: FunctionPromiseService) {

	}

	_init(environment: any) {
		let self = this;

		this._functionPromiseService.reset(this.GET_CORRECTLY_ANSWERED_QUESTIONS);
		this._functionPromiseService.initFunc(this.GET_CORRECTLY_ANSWERED_QUESTIONS, (data: any) => {
			return new Promise((resolve, reject) => {
				let url = environment.apiUrl + "/api/question/user/" + data['userId'] + "/correctlyAnsweredQuestions";
				// this._apiService.get(url)
				// .subscribe((rtn) => {
				// 	resolve(rtn);
				// }, (err) => {
				// 	reject(err);
				// })
        resolve(true);
			})
		});

		this._functionPromiseService.reset(this.GET_INCORRECTLY_ANSWERED_QUESTIONS);
		this._functionPromiseService.initFunc(this.GET_INCORRECTLY_ANSWERED_QUESTIONS, (data: any) => {
			return new Promise((resolve, reject) => {
				let url = environment.apiUrl + "/api/question/user/" + data['userId'] + "/incorrectlyAnsweredQuestions";
				// this._apiService.get(url)
				// .subscribe((rtn) => {
				// 	resolve(rtn);
				// }, (err) => {
				// 	reject(err);
				// })
        resolve(true);
			})
		});

		this._functionPromiseService.reset(this.GET_ASKED_QUESTIONS);
		this._functionPromiseService.initFunc(this.GET_ASKED_QUESTIONS, (data: any) => {
			return new Promise((resolve, reject) => {
				let url = environment.apiUrl + "/api/question/user/" + data['userId'] + "/askedQuestions";
				// this._apiService.get(url)
				// .subscribe((rtn) => {
				// 	resolve(rtn);
				// }, (err) => {
				// 	reject(err);
				// })
        resolve(true);
			})
		});

		this._functionPromiseService.reset(this.LABOUR_CONTAINS_FILTERED_QUESTIONS);
		this._functionPromiseService.initFunc(this.LABOUR_CONTAINS_FILTERED_QUESTIONS, (data: any) => {
			return new Promise((resolve, reject) => {
				let flq = data['flq'];

				// TODO: This same code appears in savvato-careerpath-component. Find a common place for it
				resolve(data['labour']['questions'].filter(
                  (q: any) => {
                    return flq.map((q1: any) => q1['id']).includes(q['id']);
                  }).length > 0)
			})
		});
	}

	answerQualityFilter = "asked"
	getQuestionCountFuncName(filter: string) {
		let funcName = undefined;
		let self = this;

		if (filter == "correct") {
			funcName = self.GET_CORRECTLY_ANSWERED_QUESTIONS;
		} else if (filter == "incorrect") {
			funcName = self.GET_INCORRECTLY_ANSWERED_QUESTIONS;
		} else {
			funcName = self.GET_ASKED_QUESTIONS;
		}

		return funcName;
	}

	getAnswerQualityFilter() {
		return this.answerQualityFilter;
	}

	setAnswerQualityFilter(filter: string) {
		this.answerQualityFilter = filter;
	}

	getAskedQuestions(userId: number) {
		return this._functionPromiseService.waitAndGet(this.GET_ASKED_QUESTIONS, this.GET_ASKED_QUESTIONS, {userId: userId});
	}

	getFilteredListOfQuestions(userId: number) {
		let funcName = this.getQuestionCountFuncName(this.answerQualityFilter);
		return this._functionPromiseService.waitAndGet(funcName, funcName, {userId: userId});
	}

	labourContainsFilteredQuestion(userId: number, labour: any) {
		if (this.answerQualityFilter === this.NO_FILTER)
			return true;

		let funcName = this.getQuestionCountFuncName(this.answerQualityFilter);
		let flq = this._functionPromiseService.get(funcName, funcName, {userId: userId});

		if (flq) {
			let rtn = this._functionPromiseService.get(this.LABOUR_CONTAINS_FILTERED_QUESTIONS+labour['id']+this.answerQualityFilter, this.LABOUR_CONTAINS_FILTERED_QUESTIONS, {userId: userId, labour: labour, flq: flq});
			return rtn;
		}

		return true;
	}

	milestoneContainsFilteredQuestion(userId: number, milestone: any) {
		let self = this;
		let rtn = milestone['labours'].filter((l: any) => {
			return self.labourContainsFilteredQuestion(userId, l);
		}).length > 0;
		return rtn;
	}

	pathContainsFilteredQuestion(userId: number, path: any) {
		let self = this;
		let rtn = path['milestones'].filter((m: any) => {
			return self.milestoneContainsFilteredQuestion(userId, m);
		}).length > 0;
		return rtn;
	}

	careerGoalContainsFilteredQuestion(userId: number, cg: any) {
		let self = this;
		return cg['paths'].filter((p: any) => {
			return self.pathContainsFilteredQuestion(userId, p);
		}).length > 0;
	}
}
