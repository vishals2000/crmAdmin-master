package com.gvc.crmadmin.domain.campaignMgmtApi;

public class StoreFileResponse {
	
	private boolean result;
	private String message;
	private int estimate;
	
	public String getMessage() {
		return message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
	public boolean isResult() {
		return result;
	}
	
	public void setResult(boolean result) {
		this.result = result;
	}
	
	public int getEstimate() {
		return estimate;
	}
	
	public void setEstimate(int estimate) {
		this.estimate = estimate;
	}

	@Override
	public String toString() {
		return "StoreFileResponse [result=" + result + ", message=" + message + ", estimate=" + estimate + "]";
	}

}