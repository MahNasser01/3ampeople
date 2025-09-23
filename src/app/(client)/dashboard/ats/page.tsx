"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ATSApplicant, ATSStatus, ATSStats } from "@/types/ats";
import { getATSService } from "@/services/ats.service";
import { Mail, Search, Users, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

function ATSPage() {
  const [applicants, setApplicants] = useState<ATSApplicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<ATSApplicant[]>([]);
  const [stats, setStats] = useState<ATSStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ATSStatus | "all">("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const atsService = getATSService();
        const [applicantsData, statsData] = await Promise.all([
          atsService.getApplicants(),
          atsService.getStats()
        ]);
        
        setApplicants(applicantsData);
        setFilteredApplicants(applicantsData);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching ATS data:", error);
        toast({
          title: "Error",
          description: "Failed to load applicant data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...applicants];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(applicant =>
        applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(applicant => applicant.status === statusFilter);
    }

    // Apply score filter
    if (scoreFilter !== "all") {
      const [min, max] = scoreFilter.split("-").map(Number);
      if (max) {
        filtered = filtered.filter(applicant => applicant.score >= min && applicant.score <= max);
      } else {
        filtered = filtered.filter(applicant => applicant.score >= min);
      }
    }

    setFilteredApplicants(filtered);
  }, [applicants, searchQuery, statusFilter, scoreFilter]);

  const handleSendScreeningInvite = async (applicantId: string) => {
    setSendingEmail(applicantId);
    try {
      const atsService = getATSService();
      const success = await atsService.sendScreeningInvite(applicantId);

      console.log("success", success);
      
      if (success) {
        toast({
          title: "Success",
          description: "Screening invitation sent successfully!",
        });
        
        // Refresh data to show updated status
        const updatedApplicants = await atsService.getApplicants();
        setApplicants(updatedApplicants);
      } else {
        toast({
          title: "Error",
          description: "Failed to send screening invitation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending screening invite:", error);
      toast({
        title: "Error",
        description: "Failed to send screening invitation",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(null);
    }
  };

  const getStatusBadgeVariant = (status: ATSStatus) => {
    switch (status) {
      case ATSStatus.NEW:
        return "default";
      case ATSStatus.SCREENING:
        return "secondary";
      case ATSStatus.INTERVIEW:
        return "outline";
      case ATSStatus.HIRED:
        return "default";
      case ATSStatus.REJECTED:
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: ATSStatus) => {
    switch (status) {
      case ATSStatus.NEW:
        return <Clock className="w-4 h-4" />;
      case ATSStatus.SCREENING:
        return <Users className="w-4 h-4" />;
      case ATSStatus.INTERVIEW:
        return <TrendingUp className="w-4 h-4" />;
      case ATSStatus.HIRED:
        return <CheckCircle className="w-4 h-4" />;
      case ATSStatus.REJECTED:
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) {return "text-green-600";}
    if (score >= 80) {return "text-blue-600";}
    if (score >= 70) {return "text-yellow-600";}
    
return "text-red-600";
  };

  if (loading) {
    return (
      <main className="p-8 pt-0 ml-12 mr-auto rounded-md">
        <div className="flex flex-col items-left">
          <h2 className="mr-2 text-2xl font-semibold tracking-tight mt-8">
            ATS Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                  <div className="h-8 bg-gray-300 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 pt-0 ml-12 mr-auto rounded-md">
      <div className="flex flex-col items-left">
        <h2 className="mr-2 text-2xl font-semibold tracking-tight mt-8">
          ATS Dashboard
        </h2>
        <h3 className="text-sm tracking-tight text-gray-600 font-medium">
          Manage your applicant pipeline
        </h3>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">New Applications</p>
                    <p className="text-2xl font-bold">{stats.new}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Screening</p>
                    <p className="text-2xl font-bold">{stats.screening}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-6 mb-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search applicants..."
              value={searchQuery}
              className="w-64"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ATSStatus | "all")}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={ATSStatus.NEW}>New</SelectItem>
              <SelectItem value={ATSStatus.SCREENING}>Screening</SelectItem>
              <SelectItem value={ATSStatus.INTERVIEW}>Interview</SelectItem>
              <SelectItem value={ATSStatus.HIRED}>Hired</SelectItem>
              <SelectItem value={ATSStatus.REJECTED}>Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={scoreFilter} onValueChange={setScoreFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="90-100">90-100</SelectItem>
              <SelectItem value="80-89">80-89</SelectItem>
              <SelectItem value="70-79">70-79</SelectItem>
              <SelectItem value="60-69">60-69</SelectItem>
              <SelectItem value="0-59">0-59</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applicants List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplicants.map((applicant) => (
            <Card key={applicant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{applicant.name}</CardTitle>
                    <p className="text-sm text-gray-600">{applicant.email}</p>
                    <p className="text-sm font-medium text-blue-600">{applicant.position}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(applicant.status)} className="flex items-center gap-1">
                    {getStatusIcon(applicant.status)}
                    {applicant.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Score:</span>
                    <span className={`font-bold ${getScoreColor(applicant.score)}`}>
                      {applicant.score}/100
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {applicant.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {applicant.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{applicant.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Experience: {applicant.experience}</p>
                    <p>Education: {applicant.education}</p>
                    <p>Applied: {applicant.appliedAt.toLocaleDateString()}</p>
                  </div>
                  
                  {applicant.status === ATSStatus.NEW && (
                    <Button
                      disabled={sendingEmail === applicant.id}
                      className="w-full"
                      onClick={() => handleSendScreeningInvite(applicant.id)}
                    >
                      {sendingEmail === applicant.id ? (
                        "Sending..."
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Screening Invite
                        </>
                      )}
                    </Button>
                  )}
                  
                  {applicant.notes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                      <p className="font-medium text-gray-700">Notes:</p>
                      <p className="text-gray-600">{applicant.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredApplicants.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default ATSPage;
