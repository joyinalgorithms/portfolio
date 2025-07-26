function viewResume() {
    const resumeUrl = "{{ url_for('static', filename='files/resume.pdf') }}";
    window.open(resumeUrl, '_blank');
}
