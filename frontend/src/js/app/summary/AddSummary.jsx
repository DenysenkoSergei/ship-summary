import React from 'react';
import {Field} from "../components/Field";
import {SummaryInfo} from "./SummaryInfo";
import {SummaryRecordRow} from "./SummaryRecordRow";
import axios from 'axios';
import {createPath} from "../../commons";
import {CommonService} from "../../CommonService";

export class AddSummary extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            summary: {
                date: '',
                trawlingCount: '',
                longitude: '',
                latitude: '',
                mode: '',
                speed: '',
                heading: '',
                comments: '',
                summaryRecords: []
            }

        };

        this.handleSummaryFieldChange = this.handleSummaryFieldChange.bind(this);
        this.handleRecordChange = this.handleRecordChange.bind(this);
        this.addSummary = this.addSummary.bind(this);
    }

    componentDidMount() {
        axios
            .get(createPath("/api/summaries/records/types"), CommonService.getAuthHeaders())
            .then(res => {
                let records = res.data.map(type => {
                    return {
                        name: type.typeEnum,
                        typeName: type.typeName,
                        units: '',
                        day: '',
                        board: ''
                    }
                });

                let newState = Object.assign({}, this.state);
                newState.summary.summaryRecords = records;
                this.setState(newState);

            })
    }

    handleRecordChange(event, typeEnum) {
        let newState = Object.assign({}, this.state);
        console.log(newState);
        console.log(event);
        console.log(typeEnum);
        newState.summary.summaryRecords
            .filter(record => record.name === typeEnum)
            .forEach(record => {
                console.log(record);
                console.log('sasi');
                record[event.target.name] = event.target.value
            });
        this.setState(newState);
    }

    handleSummaryFieldChange(event) {
        let newState = Object.assign({}, this.state);
        newState.summary[event.target.name] = event.target.value;
        this.setState(newState);
    }

    render() {
        const {summary} = this.state;

        return (
            <div className="container">
                <div className="title is-3">Введите данные сводки:</div>
                <SummaryInfo summary={summary} handleSummaryFieldChange={this.handleSummaryFieldChange}/>
                {summary.summaryRecords.map((record, index) =>
                    (
                        <SummaryRecordRow key={index} record={record} handleChange={this.handleRecordChange}/>
                    )
                )}
                <div className="field is-grouped is-grouped-centered">
                    <p className="control">
                        <button type="submit" className="button is-primary" onClick={this.addSummary}>
                            Добавить сводку
                        </button>
                    </p>
                </div>
            </div>

        );
    }

    addSummary() {
        axios
            .post(createPath("/api/summaries/"), this.state.summary, CommonService.getAuthHeaders())
            .then(res => {
                console.log(res);
            })
    }
}
