"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Plus,
  X,
  FileText,
  User,
  Mail,
  Phone,
  Building,
  AlertTriangle,
  Info,
  Upload,
  Calendar,
} from "lucide-react";

// Categories and priorities configuration
const ticketCategories = [
  { value: "network", label: "Network Issues", icon: AlertCircle },
  { value: "hardware", label: "Hardware Problems", icon: AlertTriangle },
  { value: "software", label: "Software Issues", icon: FileText },
  { value: "email", label: "Email & Communication", icon: Mail },
  { value: "database", label: "Database Issues", icon: AlertCircle },
  { value: "security", label: "Security Concerns", icon: AlertTriangle },
  { value: "access", label: "Access & Permissions", icon: User },
  { value: "other", label: "Other", icon: Info },
];

const priorityLevels = [
  {
    value: "low",
    label: "Low",
    description: "Minor issues, no business impact",
    color: "bg-green-100 text-green-800",
    icon: Info,
  },
  {
    value: "medium",
    label: "Medium",
    description: "Moderate impact, some functionality affected",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  {
    value: "high",
    label: "High",
    description: "Significant impact, major functionality affected",
    color: "bg-orange-100 text-orange-800",
    icon: AlertCircle,
  },
  {
    value: "critical",
    label: "Critical",
    description: "System down, business operations stopped",
    color: "bg-red-100 text-red-800",
    icon: AlertTriangle,
  },
];

const RaiseTicket = () => {
  const router = useRouter();
  const { currentUser } = useUser();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    department: "",
    location: "",
    contactPhone: "",
    expectedDate: "",
    additionalNotes: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle file attachments
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  // Remove attachment
  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.priority) {
      newErrors.priority = "Please select a priority level";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (
      formData.contactPhone &&
      !/^\+?[\d\s-()]+$/.test(formData.contactPhone)
    ) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate ticket ID
      const ticketId = `TKT-${Date.now().toString().slice(-6)}`;

      console.log("Ticket submitted:", {
        ...formData,
        attachments,
        ticketId,
        userId: currentUser?.user?.id,
        submittedAt: new Date().toISOString(),
      });

      setSubmitStatus("success");

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          priority: "",
          department: "",
          location: "",
          contactPhone: "",
          expectedDate: "",
          additionalNotes: "",
        });
        setAttachments([]);
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get selected category and priority objects
  const selectedCategory = ticketCategories.find(
    (cat) => cat.value === formData.category
  );
  const selectedPriority = priorityLevels.find(
    (pri) => pri.value === formData.priority
  );

  // Don't render if no user
  if (!currentUser) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Raise a Ticket</h1>
          <p className="text-muted-foreground">
            Submit a new IT support request
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {/* Success/Error Messages */}
      {submitStatus === "success" && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Ticket submitted successfully!
              </span>
            </div>
            <p className="text-green-700 mt-1 text-sm">
              Your ticket has been created and assigned a unique ID. You'll
              receive email updates on its progress.
            </p>
          </CardContent>
        </Card>
      )}

      {submitStatus === "error" && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error submitting ticket</span>
            </div>
            <p className="text-red-700 mt-1 text-sm">
              There was an issue submitting your ticket. Please try again or
              contact IT support directly.
            </p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Provide the essential details about your issue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Ticket Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Brief description of the issue"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  placeholder="e.g., Finance, HR, Operations"
                  className={errors.department ? "border-red-500" : ""}
                />
                {errors.department && (
                  <p className="text-sm text-red-500">{errors.department}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Provide detailed information about the issue, including steps to reproduce, error messages, and when it started..."
                rows={4}
                className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Minimum 10 characters ({formData.description.length}/10)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category and Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Category & Priority
            </CardTitle>
            <CardDescription>
              Help us route your ticket to the right team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Issue Category *</Label>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mt-2">
                {ticketCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.value}
                      onClick={() =>
                        handleInputChange("category", category.value)
                      }
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        formData.category === category.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {category.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <Label>Priority Level *</Label>
              <div className="grid gap-3 md:grid-cols-2 mt-2">
                {priorityLevels.map((priority) => {
                  const IconComponent = priority.icon;
                  return (
                    <div
                      key={priority.value}
                      onClick={() =>
                        handleInputChange("priority", priority.value)
                      }
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        formData.priority === priority.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-5 w-5 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {priority.label}
                            </span>
                            <Badge className={priority.color}>
                              {priority.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {priority.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.priority && (
                <p className="text-sm text-red-500 mt-1">{errors.priority}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact and Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Contact & Location Details
            </CardTitle>
            <CardDescription>
              Help our support team reach you and locate the issue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="e.g., Building A, Floor 3, Room 301"
                  className={errors.location ? "border-red-500" : ""}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                  placeholder="+91-XXXXXXXXXX"
                  className={errors.contactPhone ? "border-red-500" : ""}
                />
                {errors.contactPhone && (
                  <p className="text-sm text-red-500">{errors.contactPhone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedDate">Expected Resolution Date</Label>
              <Input
                id="expectedDate"
                type="date"
                value={formData.expectedDate}
                onChange={(e) =>
                  handleInputChange("expectedDate", e.target.value)
                }
                min={new Date().toISOString().split("T")[0]}
              />
              <p className="text-sm text-muted-foreground">
                When do you need this issue resolved? (Optional)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Attachments
            </CardTitle>
            <CardDescription>
              Upload screenshots, error logs, or other relevant files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="fileUpload"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.log"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("fileUpload").click()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Files
              </Button>
              <span className="text-sm text-muted-foreground">
                Max 10MB per file. Supported: images, documents, logs
              </span>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Additional Information
            </CardTitle>
            <CardDescription>
              Any other details that might help resolve your issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                placeholder="Any additional context, workarounds you've tried, or specific requirements..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Ready to submit your ticket?
                </p>
                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email with your ticket ID
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      title: "",
                      description: "",
                      category: "",
                      priority: "",
                      department: "",
                      location: "",
                      contactPhone: "",
                      expectedDate: "",
                      additionalNotes: "",
                    });
                    setAttachments([]);
                    setErrors({});
                  }}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Ticket
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default RaiseTicket;
